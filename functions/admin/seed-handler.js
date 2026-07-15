/**
 * seed-handler.js
 * Express handler to seed mock crime records into the Zoho Catalyst Data Store.
 * Adapts seed_data.js logic to run inside the admin function context.
 * Features 100% idempotent lookup matching and an optional '?clean=true' database reset.
 */

const fs = require('fs');
const path = require('path');
const { sendSuccess, sendError } = require('../shared');

// Helper to format Date or DateString to "YYYY-MM-DD HH:mm:ss" for Catalyst DateTime
function formatDateTime(val) {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

// Helper to format Date or DateString to "YYYY-MM-DD" for Catalyst Date
function formatDate(val) {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd}`;
}

// Seeding function (adapted from seed_data.js)
async function performSeeding(catalystApp, datastore, cleanFirst) {
  // Order of tables to delete (child first to avoid foreign key violations)
  const tablesToClear = [
    'ActSectionAssociation',
    'ChargesheetDetails',
    'ArrestSurrender',
    'Accused',
    'Victim',
    'ComplainantDetails',
    'CaseMaster',
    'CrimeHeadActSection',
    'Section',
    'Act',
    'CrimeSubHead',
    'CrimeHead',
    'Employee',
    'Court',
    'Unit',
    'UnitType',
    'District',
    'State',
    'Rank',
    'Designation',
    'CaseStatusMaster',
    'GravityOffence',
    'CaseCategory',
    'OccupationMaster',
    'ReligionMaster',
    'CasteMaster'
  ];

  // Helper to clear a table
  async function clearTable(tableName) {
    try {
      console.log(`Clearing table: ${tableName}...`);
      const table = datastore.table(tableName);
      let hasMore = true;
      
      while (hasMore) {
        const query = `SELECT ROWID FROM ${tableName} LIMIT 0, 100`;
        const queryResult = await catalystApp.zcql().executeZCQLQuery(query);
        
        if (queryResult && queryResult.length > 0) {
          const rowids = queryResult.map(r => r[tableName].ROWID);
          await table.deleteRows(rowids);
          console.log(`Deleted ${rowids.length} rows from ${tableName}.`);
        } else {
          hasMore = false;
        }
      }
    } catch (err) {
      console.log(`Failed to clear table ${tableName}:`, err.message);
    }
  }

  // Execute database reset if requested
  if (cleanFirst) {
    console.log('=== STARTING DATABASE CLEANUP ===');
    for (const table of tablesToClear) {
      await clearTable(table);
    }
    console.log('=== DATABASE CLEANUP COMPLETED ===\n');
  }

  const mockDataPath = path.join(__dirname, '../../../data/mock/mock_data.json');
  if (!fs.existsSync(mockDataPath)) {
    throw new Error(`mock_data.json not found at expected path: ${mockDataPath}`);
  }

  const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

  // Map cache to store dynamic ROWID mappings (Mock ID -> Actual Catalyst ROWID)
  const stateMap = {};
  const districtMap = {};
  const unitTypeMap = {};
  const unitMap = {};
  const rankMap = {};
  const designationMap = {};
  const employeeMap = {};
  const courtMap = {};
  const caseStatusMap = {};
  const gravityOffenceMap = {};
  const caseCategoryMap = {};
  const crimeHeadMap = {};
  const crimeSubHeadMap = {};
  const actMap = {};
  const sectionMap = {};
  const occupationMap = {};
  const religionMap = {};
  const casteMap = {};
  const caseMasterMap = {};
  const accusedMap = {};

  // Track which cases are newly inserted during this run
  const newlyInsertedCases = new Set();

  // Idempotent Batch insert rows helper
  async function seedTable(tableName, mockRows, transformFn, mapObject, keyColumn) {
    if (!mockRows || mockRows.length === 0) {
      console.log(`No records to seed for table: ${tableName}`);
      return [];
    }

    const table = datastore.table(tableName);
    
    // Step 1: Query existing rows in the table
    const existingMap = {};
    if (keyColumn && !cleanFirst) {
      try {
        const query = `SELECT ROWID, ${keyColumn} FROM ${tableName} LIMIT 0, 300`;
        const queryResult = await catalystApp.zcql().executeZCQLQuery(query);
        if (queryResult && queryResult.length > 0) {
          queryResult.forEach(row => {
            const tableRow = row[tableName];
            if (tableRow && tableRow[keyColumn] !== undefined) {
              existingMap[tableRow[keyColumn]] = tableRow.ROWID;
            }
          });
        }
      } catch (err) {
        console.log(`Table ${tableName} might be empty or query failed:`, err.message);
      }
    }

    // Step 2: Separate existing vs new rows
    const rowsToInsert = [];
    const mockRowsToInsert = [];
    
    mockRows.forEach(mockRow => {
      const dbRow = transformFn(mockRow);
      const keyVal = keyColumn ? dbRow[keyColumn] : null;
      
      if (keyColumn && !cleanFirst && existingMap[keyVal] !== undefined) {
        // Row already exists in Catalyst
        if (mapObject) {
          mapObject[mockRow.ROWID] = existingMap[keyVal];
        }
      } else {
        // Row needs to be inserted
        rowsToInsert.push(dbRow);
        mockRowsToInsert.push(mockRow);
      }
    });

    if (rowsToInsert.length === 0) {
      console.log(`All ${mockRows.length} records in ${tableName} already exist. Skipped insertion.`);
      return [];
    }

    console.log(`Seeding table: ${tableName} (${rowsToInsert.length} new records out of ${mockRows.length})...`);
    
    const insertedRows = [];
    const chunkSize = 100;
    for (let i = 0; i < rowsToInsert.length; i += chunkSize) {
      const chunk = rowsToInsert.slice(i, i + chunkSize);
      const result = await table.insertRows(chunk);
      insertedRows.push(...result);
    }
    
    if (mapObject) {
      insertedRows.forEach((insertedRow, idx) => {
        const mockRow = mockRowsToInsert[idx];
        if (mockRow && mockRow.ROWID && insertedRow && insertedRow.ROWID) {
          mapObject[mockRow.ROWID] = insertedRow.ROWID;
          // If this is CaseMaster, keep track of newly created case ROWIDs
          if (tableName === 'CaseMaster') {
            newlyInsertedCases.add(insertedRow.ROWID);
          }
        }
      });
    }
    
    return insertedRows;
  }

  // 1. State
  await seedTable('State', mockData.State, row => ({
    state_name: row.state_name
  }), stateMap, 'state_name');

  // 2. District
  await seedTable('District', mockData.District, row => ({
    district_name: row.district_name,
    state_id: stateMap[row.state_id]
  }), districtMap, 'district_name');

  // 3. UnitType
  await seedTable('UnitType', mockData.UnitType, row => ({
    unit_type_name: row.unit_type_name
  }), unitTypeMap, 'unit_type_name');

  // 4. Unit
  await seedTable('Unit', mockData.Unit, row => ({
    unit_name: row.unit_name,
    unit_type_id: unitTypeMap[row.unit_type_id],
    district_id: districtMap[row.district_id]
  }), unitMap, 'unit_name');

  // 5. Rank
  await seedTable('Rank', mockData.Rank, row => ({
    rank_name: row.rank_name
  }), rankMap, 'rank_name');

  // 6. Designation
  await seedTable('Designation', mockData.Designation, row => ({
    designation_name: row.designation_name
  }), designationMap, 'designation_name');

  // 7. Employee
  await seedTable('Employee', mockData.Employee, row => ({
    employee_name: row.employee_name,
    rank_id: rankMap[row.rank_id],
    designation_id: designationMap[row.designation_id],
    unit_id: unitMap[row.unit_id],
    badge_number: row.badge_number
  }), employeeMap, 'badge_number');

  // 8. Court
  await seedTable('Court', mockData.Court, row => ({
    court_name: row.court_name,
    district_id: districtMap[row.district_id]
  }), courtMap, 'court_name');

  // 9. CaseStatusMaster
  await seedTable('CaseStatusMaster', mockData.CaseStatusMaster, row => ({
    status_name: row.status_name
  }), caseStatusMap, 'status_name');

  // 10. GravityOffence
  await seedTable('GravityOffence', mockData.GravityOffence, row => ({
    gravity_name: row.gravity_name
  }), gravityOffenceMap, 'gravity_name');

  // 11. CaseCategory
  await seedTable('CaseCategory', mockData.CaseCategory, row => ({
    category_name: row.category_name
  }), caseCategoryMap, 'category_name');

  // 12. CrimeHead
  await seedTable('CrimeHead', mockData.CrimeHead, row => ({
    crime_head_name: row.crime_head_name
  }), crimeHeadMap, 'crime_head_name');

  // 13. CrimeSubHead
  await seedTable('CrimeSubHead', mockData.CrimeSubHead, row => ({
    crime_sub_head_name: row.crime_sub_head_name,
    crime_head_id: crimeHeadMap[row.crime_head_id]
  }), crimeSubHeadMap, 'crime_sub_head_name');

  // 14. Act
  await seedTable('Act', mockData.Act, row => ({
    act_name: row.act_name,
    act_description: row.act_description
  }), actMap, 'act_name');

  // 15. Section
  await seedTable('Section', mockData.Section, row => ({
    section_number: row.section_number,
    section_description: row.section_description,
    act_id: actMap[row.act_id]
  }), sectionMap, 'section_number');

  // 16. CrimeHeadActSection
  await seedTable('CrimeHeadActSection', mockData.CrimeHeadActSection, row => ({
    crime_head_id: crimeHeadMap[row.crime_head_id],
    crime_sub_head_id: crimeSubHeadMap[row.crime_sub_head_id],
    act_id: actMap[row.act_id],
    section_id: sectionMap[row.section_id]
  }));

  // 17. OccupationMaster
  await seedTable('OccupationMaster', mockData.OccupationMaster, row => ({
    occupation_name: row.occupation_name
  }), occupationMap, 'occupation_name');

  // 18. ReligionMaster
  await seedTable('ReligionMaster', mockData.ReligionMaster, row => ({
    religion_name: row.religion_name
  }), religionMap, 'religion_name');

  // 19. CasteMaster
  await seedTable('CasteMaster', mockData.CasteMaster, row => ({
    caste_name: row.caste_name
  }), casteMap, 'caste_name');

  console.log('=== MASTER TABLES SEEDING COMPLETED ===\n');
  console.log('=== STARTING TRANSACTION TABLES SEEDING ===\n');

  // 20. CaseMaster
  await seedTable('CaseMaster', mockData.CaseMaster, row => ({
    fir_number: row.fir_number,
    crime_registered_date: formatDateTime(row.crime_registered_date),
    incident_from_date: formatDateTime(row.incident_from_date),
    incident_to_date: formatDateTime(row.incident_to_date),
    info_received_date: formatDateTime(row.info_received_date),
    latitude: row.latitude,
    longitude: row.longitude,
    case_category_id: caseCategoryMap[row.case_category_id],
    gravity_offence_id: gravityOffenceMap[row.gravity_offence_id],
    crime_head_id: crimeHeadMap[row.crime_head_id],
    crime_sub_head_id: crimeSubHeadMap[row.crime_sub_head_id],
    case_status_id: caseStatusMap[row.case_status_id],
    court_id: courtMap[row.court_id],
    district_id: districtMap[row.district_id],
    state_id: stateMap[row.state_id],
    unit_id: unitMap[row.unit_id],
    registering_officer_id: employeeMap[row.registering_officer_id],
    place_of_occurrence: row.place_of_occurrence,
    summary_of_facts: row.summary_of_facts,
    fir_status: row.fir_status
  }), caseMasterMap, 'fir_number');

  // Filter child transactional records to only seed for newly created cases
  const filterByNewCase = row => cleanFirst || newlyInsertedCases.has(caseMasterMap[row.case_id]);

  // 21. ComplainantDetails
  const newComplainants = mockData.ComplainantDetails.filter(filterByNewCase);
  await seedTable('ComplainantDetails', newComplainants, row => ({
    case_id: caseMasterMap[row.case_id],
    name: row.name,
    age: row.age,
    gender: row.gender,
    phone: row.phone,
    address: row.address,
    occupation_id: row.occupation_id ? occupationMap[row.occupation_id] : null,
    religion_id: row.religion_id ? religionMap[row.religion_id] : null,
    caste_id: row.caste_id ? casteMap[row.caste_id] : null
  }));

  // 22. Victim
  const newVictims = mockData.Victim.filter(filterByNewCase);
  await seedTable('Victim', newVictims, row => ({
    case_id: caseMasterMap[row.case_id],
    name: row.name,
    age: row.age,
    gender: row.gender,
    injury_type: row.injury_type,
    phone: row.phone,
    address: row.address,
    occupation_id: row.occupation_id ? occupationMap[row.occupation_id] : null,
    religion_id: row.religion_id ? religionMap[row.religion_id] : null,
    caste_id: row.caste_id ? casteMap[row.caste_id] : null
  }));

  // 23. Accused
  const newAccused = mockData.Accused.filter(filterByNewCase);
  await seedTable('Accused', newAccused, row => ({
    case_id: caseMasterMap[row.case_id],
    system_accused_id: row.system_accused_id,
    name: row.name,
    alias_name: row.alias_name,
    age: row.age,
    gender: row.gender,
    address: row.address,
    occupation_id: row.occupation_id ? occupationMap[row.occupation_id] : null,
    religion_id: row.religion_id ? religionMap[row.religion_id] : null,
    caste_id: row.caste_id ? casteMap[row.caste_id] : null,
    status: row.status
  }), accusedMap);

  // 24. ArrestSurrender
  const newArrests = mockData.ArrestSurrender.filter(filterByNewCase);
  await seedTable('ArrestSurrender', newArrests, row => ({
    case_id: caseMasterMap[row.case_id],
    accused_id: accusedMap[row.accused_id],
    event_type: row.event_type,
    date_time: formatDateTime(row.date_time),
    place: row.place,
    arresting_officer_id: employeeMap[row.arresting_officer_id],
    remarks: row.remarks
  }));

  // 25. ChargesheetDetails
  const newChargesheets = mockData.ChargesheetDetails.filter(filterByNewCase);
  await seedTable('ChargesheetDetails', newChargesheets, row => ({
    case_id: caseMasterMap[row.case_id],
    chargesheet_number: row.chargesheet_number,
    date_filed: formatDate(row.date_filed),
    submitting_officer_id: employeeMap[row.submitting_officer_id],
    court_id: courtMap[row.court_id],
    summary_of_evidence: row.summary_of_evidence,
    final_report_type: row.final_report_type
  }));

  // 26. ActSectionAssociation
  const newAssociations = mockData.ActSectionAssociation.filter(filterByNewCase);
  await seedTable('ActSectionAssociation', newAssociations, row => ({
    case_id: caseMasterMap[row.case_id],
    act_id: actMap[row.act_id],
    section_id: sectionMap[row.section_id]
  }));
}

module.exports = async (req, res) => {
  try {
    const { getCatalystApp } = require('../shared');
    const catalystApp = getCatalystApp(req);
    const datastore = catalystApp.datastore();
    
    const cleanFirst = req.query && req.query.clean === 'true';
    
    await performSeeding(catalystApp, datastore, cleanFirst);
    
    return sendSuccess(res, { message: 'Database seeding completed successfully.' });
  } catch (err) {
    console.error('Error during HTTP seeding:', err);
    return sendError(res, 'SEEDING_FAILED', err.message, 500);
  }
};
