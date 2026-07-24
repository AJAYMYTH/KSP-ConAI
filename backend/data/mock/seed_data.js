/**
 * seed_data.js
 * Inserts the generated mock crime records into the Zoho Catalyst Data Store using the Catalyst Node.js SDK.
 * Handles the relational dependencies by seeding tables in order and mapping ROWIDs dynamically.
 */

const fs = require('fs');
const path = require('path');
const catalyst = require('zcatalyst-sdk-node');

// Load environment variables if dotenv is available
try {
  require('dotenv').config();
} catch (err) {
  // Safe to ignore if environment variables are set directly or in execution context
}

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

// Helper to batch insert rows
async function seedTable(datastore, tableName, mockRows, transformFn, mapObject) {
  if (!mockRows || mockRows.length === 0) {
    console.log(`No records to seed for table: ${tableName}`);
    return [];
  }

  console.log(`Seeding table: ${tableName} (${mockRows.length} records)...`);
  const table = datastore.table(tableName);
  
  // Transform mock records into database-ready format (resolving foreign keys)
  const dbRows = mockRows.map(transformFn);
  
  // Insert in chunks of 100 to avoid payload size limits and network timeouts
  const insertedRows = [];
  const chunkSize = 100;
  for (let i = 0; i < dbRows.length; i += chunkSize) {
    const chunk = dbRows.slice(i, i + chunkSize);
    try {
      const result = await table.insertRows(chunk);
      insertedRows.push(...result);
      console.log(`  - Inserted chunk ${Math.floor(i / chunkSize) + 1} (${chunk.length} rows)`);
    } catch (err) {
      console.error(`Error inserting chunk in ${tableName} at index ${i}:`, err.message || err);
      throw err;
    }
  }
  
  // Record mapping from mock ID (ROWID) to actual database ROWID for subsequent foreign keys
  if (mapObject) {
    insertedRows.forEach((insertedRow, idx) => {
      const mockRow = mockRows[idx];
      if (mockRow && mockRow.ROWID && insertedRow && insertedRow.ROWID) {
        mapObject[mockRow.ROWID] = insertedRow.ROWID;
      }
    });
  }
  
  console.log(`Successfully seeded ${insertedRows.length} records into ${tableName}.\n`);
  return insertedRows;
}

// Main execution function
async function main() {
  console.log('=== KSP CRIME INTELLIGENCE COPILOT - SEEDER ===\n');

  // Load mock data
  let mockData;
  const mockDataPath = path.join(__dirname, 'mock_data.json');
  if (fs.existsSync(mockDataPath)) {
    console.log(`Loading mock data from: ${mockDataPath}`);
    mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
  } else {
    console.log('mock_data.json not found. Generating mock data dynamically...');
    const generator = require('./generate_mock_data');
    mockData = generator.mockData;
  }

  // Initialize Catalyst App
  let app;
  const isLocalConfigAvailable = process.env.CATALYST_PROJECT_ID && process.env.CATALYST_PROJECT_KEY;

  try {
    if (isLocalConfigAvailable) {
      console.log('Initializing Catalyst SDK using local credentials...');
      app = catalyst.initialize({
        project_id: process.env.CATALYST_PROJECT_ID,
        project_key: process.env.CATALYST_PROJECT_KEY,
        environment: process.env.CATALYST_ENVIRONMENT || 'development',
        auth: {
          client_id: process.env.CATALYST_CLIENT_ID,
          client_secret: process.env.CATALYST_CLIENT_SECRET,
          refresh_token: process.env.CATALYST_REFRESH_TOKEN
        }
      });
    } else {
      console.log('Initializing Catalyst SDK inside runtime container context...');
      // Expecting standard CLI or function environment settings
      app = catalyst.initialize();
    }
  } catch (err) {
    console.error('Fatal: Failed to initialize Catalyst SDK.');
    console.error('Please configure your .env file or run this script in an authenticated Catalyst environment.');
    console.error('Error Details:', err.message || err);
    process.exit(1);
  }

  const datastore = app.datastore();

  try {
    // 1. State
    await seedTable(datastore, 'State', mockData.State, row => ({
      state_name: row.state_name
    }), stateMap);

    // 2. District
    await seedTable(datastore, 'District', mockData.District, row => ({
      district_name: row.district_name,
      state_id: stateMap[row.state_id]
    }), districtMap);

    // 3. UnitType
    await seedTable(datastore, 'UnitType', mockData.UnitType, row => ({
      unit_type_name: row.unit_type_name
    }), unitTypeMap);

    // 4. Unit
    await seedTable(datastore, 'Unit', mockData.Unit, row => ({
      unit_name: row.unit_name,
      unit_type_id: unitTypeMap[row.unit_type_id],
      district_id: districtMap[row.district_id]
    }), unitMap);

    // 5. Rank
    await seedTable(datastore, 'Rank', mockData.Rank, row => ({
      rank_name: row.rank_name
    }), rankMap);

    // 6. Designation
    await seedTable(datastore, 'Designation', mockData.Designation, row => ({
      designation_name: row.designation_name
    }), designationMap);

    // 7. Employee
    await seedTable(datastore, 'Employee', mockData.Employee, row => ({
      employee_name: row.employee_name,
      rank_id: rankMap[row.rank_id],
      designation_id: designationMap[row.designation_id],
      unit_id: unitMap[row.unit_id],
      badge_number: row.badge_number
    }), employeeMap);

    // 8. Court
    await seedTable(datastore, 'Court', mockData.Court, row => ({
      court_name: row.court_name,
      district_id: districtMap[row.district_id]
    }), courtMap);

    // 9. CaseStatusMaster
    await seedTable(datastore, 'CaseStatusMaster', mockData.CaseStatusMaster, row => ({
      status_name: row.status_name
    }), caseStatusMap);

    // 10. GravityOffence
    await seedTable(datastore, 'GravityOffence', mockData.GravityOffence, row => ({
      gravity_name: row.gravity_name
    }), gravityOffenceMap);

    // 11. CaseCategory
    await seedTable(datastore, 'CaseCategory', mockData.CaseCategory, row => ({
      category_name: row.category_name
    }), caseCategoryMap);

    // 12. CrimeHead
    await seedTable(datastore, 'CrimeHead', mockData.CrimeHead, row => ({
      crime_head_name: row.crime_head_name
    }), crimeHeadMap);

    // 13. CrimeSubHead
    await seedTable(datastore, 'CrimeSubHead', mockData.CrimeSubHead, row => ({
      crime_sub_head_name: row.crime_sub_head_name,
      crime_head_id: crimeHeadMap[row.crime_head_id]
    }), crimeSubHeadMap);

    // 14. Act
    await seedTable(datastore, 'Act', mockData.Act, row => ({
      act_name: row.act_name,
      act_description: row.act_description
    }), actMap);

    // 15. Section
    await seedTable(datastore, 'Section', mockData.Section, row => ({
      section_number: row.section_number,
      section_description: row.section_description,
      act_id: actMap[row.act_id]
    }), sectionMap);

    // 16. CrimeHeadActSection
    await seedTable(datastore, 'CrimeHeadActSection', mockData.CrimeHeadActSection, row => ({
      crime_head_id: crimeHeadMap[row.crime_head_id],
      crime_sub_head_id: crimeSubHeadMap[row.crime_sub_head_id],
      act_id: actMap[row.act_id],
      section_id: sectionMap[row.section_id]
    }));

    // 17. OccupationMaster
    await seedTable(datastore, 'OccupationMaster', mockData.OccupationMaster, row => ({
      occupation_name: row.occupation_name
    }), occupationMap);

    // 18. ReligionMaster
    await seedTable(datastore, 'ReligionMaster', mockData.ReligionMaster, row => ({
      religion_name: row.religion_name
    }), religionMap);

    // 19. CasteMaster
    await seedTable(datastore, 'CasteMaster', mockData.CasteMaster, row => ({
      caste_name: row.caste_name
    }), casteMap);

    console.log('=== MASTER TABLES SEEDING COMPLETED ===\n');
    console.log('=== STARTING TRANSACTION TABLES SEEDING ===\n');

    // 20. CaseMaster
    await seedTable(datastore, 'CaseMaster', mockData.CaseMaster, row => ({
      fir_number: row.fir_number,
      crime_registered_date: row.crime_registered_date,
      incident_from_date: row.incident_from_date,
      incident_to_date: row.incident_to_date,
      info_received_date: row.info_received_date,
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
    }), caseMasterMap);

    // 21. ComplainantDetails
    await seedTable(datastore, 'ComplainantDetails', mockData.ComplainantDetails, row => ({
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
    await seedTable(datastore, 'Victim', mockData.Victim, row => ({
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
    await seedTable(datastore, 'Accused', mockData.Accused, row => ({
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
    await seedTable(datastore, 'ArrestSurrender', mockData.ArrestSurrender, row => ({
      case_id: caseMasterMap[row.case_id],
      accused_id: accusedMap[row.accused_id],
      event_type: row.event_type,
      date_time: row.date_time,
      place: row.place,
      arresting_officer_id: employeeMap[row.arresting_officer_id],
      remarks: row.remarks
    }));

    // 25. ChargesheetDetails
    await seedTable(datastore, 'ChargesheetDetails', mockData.ChargesheetDetails, row => ({
      case_id: caseMasterMap[row.case_id],
      chargesheet_number: row.chargesheet_number,
      date_filed: row.date_filed,
      submitting_officer_id: employeeMap[row.submitting_officer_id],
      court_id: courtMap[row.court_id],
      summary_of_evidence: row.summary_of_evidence,
      final_report_type: row.final_report_type
    }));

    // 26. ActSectionAssociation
    await seedTable(datastore, 'ActSectionAssociation', mockData.ActSectionAssociation, row => ({
      case_id: caseMasterMap[row.case_id],
      act_id: actMap[row.act_id],
      section_id: sectionMap[row.section_id]
    }));

    console.log('=== ALL TRANSACTION TABLES SEEDING COMPLETED ===');
    console.log('\nDatabase seeding finished successfully!');
  } catch (err) {
    console.error('\nSeeding failed with errors:', err.message || err);
    process.exit(1);
  }
}

// Execute seeder
main();
