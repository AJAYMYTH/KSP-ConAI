const express = require('express');
const { executeQuery, escapeString, checkRole, redactPII, getCacheValue, setCacheValue, sendSuccess, sendError } = require('../shared');

const app = express();
app.use(express.json());

// GET /graph/case/:caseId
app.get('/graph/case/:caseId', checkRole(['admin', 'investigator', 'analyst']), async (req, res) => {
  const caseId = req.params.caseId;
  const depth = parseInt(req.query.depth) || 1;
  const userRole = req.user.role;

  if (!caseId) {
    return sendError(res, 'MISSING_PARAM', 'Case ID is required.');
  }

  // Check cache first
  const cacheKey = `graph_case_${caseId}_depth_${depth}`;
  const cachedData = await getCacheValue(req, cacheKey);
  if (cachedData) {
    // Apply redaction of PII if viewer role (middleware handles roles but check here for safety)
    const redacted = userRole === 'viewer' ? redactPII(cachedData, userRole) : cachedData;
    return sendSuccess(res, redacted, { source: 'cache' });
  }

  try {
    // 1. Fetch Case Master
    const caseSql = `SELECT CaseMaster.ROWID, CaseMaster.fir_number, CaseMaster.unit_id, Unit.unit_name, District.district_name 
                     FROM CaseMaster 
                     LEFT JOIN Unit ON CaseMaster.unit_id = Unit.ROWID 
                     LEFT JOIN District ON CaseMaster.district_id = District.ROWID 
                     WHERE CaseMaster.ROWID = ${escapeString(caseId)}`;
    const caseRows = await executeQuery(req, caseSql);
    
    if (caseRows.length === 0) {
      return sendError(res, 'NOT_FOUND', 'Case not found.', 404);
    }
    
    const rootCase = caseRows[0].CaseMaster;
    const rootUnit = caseRows[0].Unit;
    const rootDistrict = caseRows[0].District;

    // Nodes and Edges arrays
    const nodes = [];
    const edges = [];
    const addedNodeIds = new Set();

    // Helper to add nodes safely without duplicates
    function addNode(id, label, type, details = {}) {
      if (addedNodeIds.has(id)) return;
      addedNodeIds.add(id);
      nodes.push({
        data: {
          id,
          label,
          type,
          ...details
        }
      });
    }

    // Helper to add edges safely
    function addEdge(id, source, target, label = '') {
      edges.push({
        data: {
          id,
          source,
          target,
          label
        }
      });
    }

    // Add root Case Node
    const caseNodeId = `case_${rootCase.ROWID}`;
    addNode(caseNodeId, `FIR: ${rootCase.fir_number}`, 'case', {
      fir_number: rootCase.fir_number,
      district_name: rootDistrict?.district_name,
      unit_name: rootUnit?.unit_name
    });

    // Add Station Node
    if (rootUnit && rootUnit.unit_name) {
      const stationNodeId = `station_${rootCase.unit_id}`;
      addNode(stationNodeId, `Station: ${rootUnit.unit_name}`, 'station', {
        unit_name: rootUnit.unit_name
      });
      addEdge(`edge_case_station_${rootCase.ROWID}`, caseNodeId, stationNodeId, 'Registered At');
    }

    // 2. Fetch Complainants
    const compSql = `SELECT ROWID, name, age, gender, phone, address FROM ComplainantDetails WHERE case_id = ${escapeString(caseId)}`;
    const compRows = await executeQuery(req, compSql);
    compRows.forEach(row => {
      const comp = row.ComplainantDetails;
      const compNodeId = `comp_${comp.ROWID}`;
      
      // Apply role-based PII redaction if necessary
      const details = redactPII({
        name: comp.name,
        age: comp.age,
        gender: comp.gender,
        phone: comp.phone,
        address: comp.address
      }, userRole);

      addNode(compNodeId, `Complainant: ${details.name}`, 'complainant', details);
      addEdge(`edge_case_comp_${comp.ROWID}`, caseNodeId, compNodeId, 'Complained By');
    });

    // 3. Fetch Victims
    const vicSql = `SELECT ROWID, name, age, gender, injury_type, phone, address FROM Victim WHERE case_id = ${escapeString(caseId)}`;
    const vicRows = await executeQuery(req, vicSql);
    vicRows.forEach(row => {
      const vic = row.Victim;
      const vicNodeId = `vic_${vic.ROWID}`;
      
      const details = redactPII({
        name: vic.name,
        age: vic.age,
        gender: vic.gender,
        injury_type: vic.injury_type,
        phone: vic.phone,
        address: vic.address
      }, userRole);

      addNode(vicNodeId, `Victim: ${details.name}`, 'victim', details);
      addEdge(`edge_case_vic_${vic.ROWID}`, caseNodeId, vicNodeId, 'Victimized');
    });

    // 4. Fetch Accused
    const accSql = `SELECT ROWID, name, system_accused_id, age, gender, status, address FROM Accused WHERE case_id = ${escapeString(caseId)}`;
    const accRows = await executeQuery(req, accSql);
    
    // Map system_accused_id to local node ID for repeat offender joins
    const accusedIdMap = {};
    const systemAccusedIds = [];

    accRows.forEach(row => {
      const acc = row.Accused;
      const accNodeId = `acc_${acc.ROWID}`;
      
      const details = redactPII({
        name: acc.name,
        system_accused_id: acc.system_accused_id,
        age: acc.age,
        gender: acc.gender,
        status: acc.status,
        address: acc.address
      }, userRole);

      addNode(accNodeId, `Accused: ${details.name}`, 'accused', details);
      addEdge(`edge_case_acc_${acc.ROWID}`, caseNodeId, accNodeId, 'Accused');

      if (acc.system_accused_id) {
        accusedIdMap[acc.system_accused_id] = accNodeId;
        systemAccusedIds.push(`'${escapeString(acc.system_accused_id)}'`);
      }
    });

    // 5. Fetch Acts and Sections
    const secSql = `SELECT ActSectionAssociation.ROWID, Act.ROWID AS act_id, Act.act_name, Section.ROWID AS section_id, Section.section_number, Section.section_description 
                    FROM ActSectionAssociation 
                    LEFT JOIN Act ON ActSectionAssociation.act_id = Act.ROWID 
                    LEFT JOIN Section ON ActSectionAssociation.section_id = Section.ROWID 
                    WHERE ActSectionAssociation.case_id = ${escapeString(caseId)}`;
    const secRows = await executeQuery(req, secSql);
    secRows.forEach(row => {
      const assoc = row.ActSectionAssociation;
      const act = row.Act;
      const sec = row.Section;
      
      if (sec && sec.section_id) {
        const secNodeId = `sec_${sec.section_id}`;
        addNode(secNodeId, `Sec: ${sec.section_number}`, 'section', {
          section_number: sec.section_number,
          description: sec.section_description
        });
        addEdge(`edge_case_sec_${assoc.ROWID}`, caseNodeId, secNodeId, 'Charged Under');
        
        if (act && act.act_id) {
          const actNodeId = `act_${act.act_id}`;
          addNode(actNodeId, act.act_name, 'act', {
            act_name: act.act_name
          });
          addEdge(`edge_sec_act_${assoc.ROWID}`, secNodeId, actNodeId, 'Belongs To');
        }
      }
    });

    // 6. Progressive Expansion (depth > 1) - Repeat Offenders linked cases
    if (depth > 1 && systemAccusedIds.length > 0) {
      const linkedSql = `SELECT Accused.case_id, Accused.system_accused_id, Accused.name, CaseMaster.fir_number, District.district_name, Unit.unit_name 
                         FROM Accused 
                         INNER JOIN CaseMaster ON Accused.case_id = CaseMaster.ROWID 
                         LEFT JOIN District ON CaseMaster.district_id = District.ROWID 
                         LEFT JOIN Unit ON CaseMaster.unit_id = Unit.ROWID 
                         WHERE Accused.system_accused_id IN (${systemAccusedIds.join(',')}) AND Accused.case_id != ${escapeString(caseId)}`;
      const linkedRows = await executeQuery(req, linkedSql);
      
      linkedRows.forEach(row => {
        const linkedAcc = row.Accused;
        const linkedCase = row.CaseMaster;
        const linkedDistrict = row.District;
        const linkedUnit = row.Unit;

        const linkedCaseNodeId = `case_${linkedAcc.case_id}`;
        
        // Add the linked case node
        addNode(linkedCaseNodeId, `FIR: ${linkedCase.fir_number}`, 'case', {
          fir_number: linkedCase.fir_number,
          district_name: linkedDistrict?.district_name,
          unit_name: linkedUnit?.unit_name,
          linked: true
        });

        // Add edge from linked case node to the matching accused node of the root case
        const parentAccNodeId = accusedIdMap[linkedAcc.system_accused_id];
        if (parentAccNodeId) {
          addEdge(`edge_linked_${linkedAcc.case_id}_${linkedAcc.system_accused_id}`, linkedCaseNodeId, parentAccNodeId, 'Also Accused In');
        }
      });
    }

    const graphPayload = {
      nodes,
      edges,
      metadata: {
        caseId,
        depth,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        generatedAt: new Date().toISOString()
      }
    };

    // Cache the graph representation
    await setCacheValue(req, cacheKey, graphPayload, 1);

    // Apply redactions to PII before final delivery (if role is viewer)
    const finalPayload = userRole === 'viewer' ? redactPII(graphPayload, userRole) : graphPayload;

    return sendSuccess(res, finalPayload);
  } catch (err) {
    console.error('Error constructing relationship graph:', err.message || err);
    return sendError(res, 'DB_ERROR', 'Failed to construct relationship network.');
  }
});

module.exports = app;
