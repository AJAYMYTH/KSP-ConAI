const { getCatalystApp, flattenResults } = require('../shared/catalyst');
const { sendSuccess, sendError } = require('../shared/response');

async function getCaseDetail(req, res) {
  try {
    const app = getCatalystApp(req);
    const caseId = req.params.caseId;

    if (!caseId) {
      return sendError(res, 'INVALID_INPUT', 'Case ID or FIR number is required.', 400);
    }

    const safeCaseId = String(caseId).replace(/'/g, "''");
    const isNumeric = /^\d+$/.test(caseId);
    const caseWhere = isNumeric ? `CaseMaster.ROWID = ${caseId}` : `CaseMaster.fir_number = '${safeCaseId}' OR CaseMaster.fir_number LIKE '%${safeCaseId}%'`;

    // 1. Build queries to fetch all related case details
    const queries = {
      caseMasterPart1: `SELECT CaseMaster.ROWID, CaseMaster.fir_number, CaseMaster.crime_registered_date, CaseMaster.incident_from_date, CaseMaster.incident_to_date, CaseMaster.info_received_date, CaseMaster.latitude, CaseMaster.longitude, CaseMaster.place_of_occurrence, CaseMaster.summary_of_facts, CaseMaster.fir_status, District.district_name, Unit.unit_name, Court.court_name FROM CaseMaster LEFT JOIN District ON CaseMaster.district_id = District.ROWID LEFT JOIN Unit ON CaseMaster.unit_id = Unit.ROWID LEFT JOIN Court ON CaseMaster.court_id = Court.ROWID WHERE ${caseWhere}`,
      caseMasterPart2: `SELECT CaseMaster.ROWID, CaseCategory.category_name, CaseStatusMaster.status_name, GravityOffence.gravity_name, Employee.employee_name AS registering_officer_name FROM CaseMaster LEFT JOIN CaseCategory ON CaseMaster.case_category_id = CaseCategory.ROWID LEFT JOIN CaseStatusMaster ON CaseMaster.case_status_id = CaseStatusMaster.ROWID LEFT JOIN GravityOffence ON CaseMaster.gravity_offence_id = GravityOffence.ROWID LEFT JOIN Employee ON CaseMaster.registering_officer_id = Employee.ROWID WHERE ${caseWhere}`,
    };

    // Execute case master queries first to get exact ROWID
    const caseMasterPart1List = flattenResults(await app.zcql().executeZCQLQuery(queries.caseMasterPart1).catch(err => {
      console.warn('Query caseMasterPart1 failed:', err.message || err);
      return [];
    }));

    if (!caseMasterPart1List || caseMasterPart1List.length === 0) {
      return sendError(res, 'NOT_FOUND', `Case '${caseId}' not found in database.`, 404);
    }

    const caseObjPart1 = caseMasterPart1List[0];
    const actualRowId = caseObjPart1.ROWID;

    const relQueries = {
      caseMasterPart2: queries.caseMasterPart2,
      complainants: `SELECT CD.ROWID, CD.name, CD.age, CD.gender, CD.phone, CD.address, CD.occupation_id, CD.religion_id, CD.caste_id, OccupationMaster.occupation_name, ReligionMaster.religion_name, CasteMaster.caste_name FROM ComplainantDetails CD LEFT JOIN OccupationMaster ON CD.occupation_id = OccupationMaster.ROWID LEFT JOIN ReligionMaster ON CD.religion_id = ReligionMaster.ROWID LEFT JOIN CasteMaster ON CD.caste_id = CasteMaster.ROWID WHERE CD.case_id = ${actualRowId}`,
      victims: `SELECT V.ROWID, V.name, V.age, V.gender, V.phone, V.address, V.injury_type, V.occupation_id, V.religion_id, V.caste_id, OccupationMaster.occupation_name, ReligionMaster.religion_name, CasteMaster.caste_name FROM Victim V LEFT JOIN OccupationMaster ON V.occupation_id = OccupationMaster.ROWID LEFT JOIN ReligionMaster ON V.religion_id = ReligionMaster.ROWID LEFT JOIN CasteMaster ON V.caste_id = CasteMaster.ROWID WHERE V.case_id = ${actualRowId}`,
      accused: `SELECT A.ROWID, A.system_accused_id, A.name, A.alias_name, A.age, A.gender, A.address, A.status, A.occupation_id, A.religion_id, A.caste_id, OccupationMaster.occupation_name, ReligionMaster.religion_name, CasteMaster.caste_name FROM Accused A LEFT JOIN OccupationMaster ON A.occupation_id = OccupationMaster.ROWID LEFT JOIN ReligionMaster ON A.religion_id = ReligionMaster.ROWID LEFT JOIN CasteMaster ON A.caste_id = CasteMaster.ROWID WHERE A.case_id = ${actualRowId}`,
      arrests: `SELECT Arrest.ROWID, Arrest.accused_id, Arrest.event_type, Arrest.date_time, Arrest.place, Arrest.remarks, Employee.employee_name AS arresting_officer_name FROM ArrestSurrender Arrest LEFT JOIN Employee ON Arrest.arresting_officer_id = Employee.ROWID WHERE Arrest.case_id = ${actualRowId}`,
      acts: `SELECT ASA.ROWID, Act.act_name, Section.section_number, Section.section_description FROM ActSectionAssociation ASA LEFT JOIN Act ON ASA.act_id = Act.ROWID LEFT JOIN Section ON ASA.section_id = Section.ROWID WHERE ASA.case_id = ${actualRowId}`,
      chargesheet: `SELECT CD.ROWID, CD.chargesheet_number, CD.date_filed, CD.summary_of_evidence, CD.final_report_type, Employee.employee_name AS submitting_officer_name, Court.court_name FROM ChargesheetDetails CD LEFT JOIN Employee ON CD.submitting_officer_id = Employee.ROWID LEFT JOIN Court ON CD.court_id = Court.ROWID WHERE CD.case_id = ${actualRowId}`
    };

    // Execute relative queries in parallel
    const keys = Object.keys(relQueries);
    const promises = keys.map(k => app.zcql().executeZCQLQuery(relQueries[k]).catch(err => {
      console.warn(`Query ${k} failed:`, err.message || err);
      return [];
    }));

    const rawResults = await Promise.all(promises);
    
    const resolvedData = {};
    keys.forEach((k, idx) => {
      resolvedData[k] = flattenResults(rawResults[idx]);
    });

    const caseObjPart2 = resolvedData.caseMasterPart2 && resolvedData.caseMasterPart2.length > 0 ? resolvedData.caseMasterPart2[0] : {};
    
    // Assemble the composite case object
    let fullCaseDetail = {
      ...caseObjPart1,
      ...caseObjPart2,
      complainants: resolvedData.complainants || [],
      victims: resolvedData.victims || [],
      accused: resolvedData.accused || [],
      arrests: resolvedData.arrests || [],
      acts: resolvedData.acts || [],
      chargesheet: resolvedData.chargesheet && resolvedData.chargesheet.length > 0 ? resolvedData.chargesheet[0] : null
    };

    // 2. Enforce Role-based PII Redaction
    const hasPiiPermission = req.user && req.user.permissions && req.user.permissions.includes('view_pii');
    fullCaseDetail = redactPII(fullCaseDetail, hasPiiPermission);

    return sendSuccess(res, {
      case: fullCaseDetail,
      complainants: fullCaseDetail.complainants,
      victims: fullCaseDetail.victims,
      accused: fullCaseDetail.accused,
      arrests: fullCaseDetail.arrests,
      acts: fullCaseDetail.acts,
      chargesheets: fullCaseDetail.chargesheet ? [fullCaseDetail.chargesheet] : []
    }, {
      generatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Get case detail error:', err);
    return sendError(res, 'DB_ERROR', err.message || 'Error retrieving case details.', 500);
  }
}

function redactPII(caseData, hasPiiPermission) {
  if (hasPiiPermission) {
    return caseData;
  }

  const redacted = { ...caseData };

  // Redact Complainants PII
  if (redacted.complainants) {
    redacted.complainants = redacted.complainants.map(c => ({
      ...c,
      name: c.name || 'Complainant',
      phone: '[REDACTED]',
      address: '[REDACTED]',
      religion_name: '[REDACTED]',
      caste_name: '[REDACTED]',
      religion_id: null,
      caste_id: null
    }));
  }

  // Redact Victims PII
  if (redacted.victims) {
    redacted.victims = redacted.victims.map(v => ({
      ...v,
      name: v.name || 'Victim',
      phone: '[REDACTED]',
      address: '[REDACTED]',
      religion_name: '[REDACTED]',
      caste_name: '[REDACTED]',
      religion_id: null,
      caste_id: null
    }));
  }

  // Redact Accused PII
  if (redacted.accused) {
    redacted.accused = redacted.accused.map(a => ({
      ...a,
      name: a.name || 'Accused',
      address: '[REDACTED]',
      religion_name: '[REDACTED]',
      caste_name: '[REDACTED]',
      religion_id: null,
      caste_id: null
    }));
  }

  return redacted;
}

module.exports = {
  getCaseDetail
};
