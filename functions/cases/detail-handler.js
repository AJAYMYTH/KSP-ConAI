const { getCatalystApp, flattenResults } = require('../shared/catalyst');
const { sendSuccess, sendError } = require('../shared/response');

async function getCaseDetail(req, res) {
  try {
    const app = getCatalystApp(req);
    const caseId = parseInt(req.params.caseId);

    if (isNaN(caseId)) {
      return sendError(res, 'INVALID_INPUT', 'Case ID must be a valid integer.', 400);
    }

    // 1. Build queries to fetch all related case details
    const queries = {
      caseMaster: `SELECT CaseMaster.ROWID, CaseMaster.fir_number, CaseMaster.crime_registered_date, CaseMaster.incident_from_date, CaseMaster.incident_to_date, CaseMaster.info_received_date, CaseMaster.latitude, CaseMaster.longitude, CaseMaster.place_of_occurrence, CaseMaster.summary_of_facts, CaseMaster.fir_status, District.district_name, CaseCategory.category_name, CaseStatusMaster.status_name, GravityOffence.gravity_name, Court.court_name, Unit.unit_name, Employee.employee_name AS registering_officer_name FROM CaseMaster LEFT JOIN District ON CaseMaster.district_id = District.ROWID LEFT JOIN CaseCategory ON CaseMaster.case_category_id = CaseCategory.ROWID LEFT JOIN CaseStatusMaster ON CaseMaster.case_status_id = CaseStatusMaster.ROWID LEFT JOIN GravityOffence ON CaseMaster.gravity_offence_id = GravityOffence.ROWID LEFT JOIN Court ON CaseMaster.court_id = Court.ROWID LEFT JOIN Unit ON CaseMaster.unit_id = Unit.ROWID LEFT JOIN Employee ON CaseMaster.registering_officer_id = Employee.ROWID WHERE CaseMaster.ROWID = ${caseId}`,
      complainants: `SELECT CD.ROWID, CD.name, CD.age, CD.gender, CD.phone, CD.address, CD.occupation_id, CD.religion_id, CD.caste_id, OccupationMaster.occupation_name, ReligionMaster.religion_name, CasteMaster.caste_name FROM ComplainantDetails CD LEFT JOIN OccupationMaster ON CD.occupation_id = OccupationMaster.ROWID LEFT JOIN ReligionMaster ON CD.religion_id = ReligionMaster.ROWID LEFT JOIN CasteMaster ON CD.caste_id = CasteMaster.ROWID WHERE CD.case_id = ${caseId}`,
      victims: `SELECT V.ROWID, V.name, V.age, V.gender, V.phone, V.address, V.injury_type, V.occupation_id, V.religion_id, V.caste_id, OccupationMaster.occupation_name, ReligionMaster.religion_name, CasteMaster.caste_name FROM Victim V LEFT JOIN OccupationMaster ON V.occupation_id = OccupationMaster.ROWID LEFT JOIN ReligionMaster ON V.religion_id = ReligionMaster.ROWID LEFT JOIN CasteMaster ON V.caste_id = CasteMaster.ROWID WHERE V.case_id = ${caseId}`,
      accused: `SELECT A.ROWID, A.system_accused_id, A.name, A.alias_name, A.age, A.gender, A.address, A.status, A.occupation_id, A.religion_id, A.caste_id, OccupationMaster.occupation_name, ReligionMaster.religion_name, CasteMaster.caste_name FROM Accused A LEFT JOIN OccupationMaster ON A.occupation_id = OccupationMaster.ROWID LEFT JOIN ReligionMaster ON A.religion_id = ReligionMaster.ROWID LEFT JOIN CasteMaster ON A.caste_id = CasteMaster.ROWID WHERE A.case_id = ${caseId}`,
      arrests: `SELECT AS.ROWID, AS.accused_id, AS.event_type, AS.date_time, AS.place, AS.remarks, Employee.employee_name AS arresting_officer_name FROM ArrestSurrender AS LEFT JOIN Employee ON AS.arresting_officer_id = Employee.ROWID WHERE AS.case_id = ${caseId}`,
      acts: `SELECT ASA.ROWID, Act.act_name, Section.section_number, Section.section_description FROM ActSectionAssociation ASA LEFT JOIN Act ON ASA.act_id = Act.ROWID LEFT JOIN Section ON ASA.section_id = Section.ROWID WHERE ASA.case_id = ${caseId}`,
      chargesheet: `SELECT CD.ROWID, CD.chargesheet_number, CD.date_filed, CD.summary_of_evidence, CD.final_report_type, Employee.employee_name AS submitting_officer_name, Court.court_name FROM ChargesheetDetails CD LEFT JOIN Employee ON CD.submitting_officer_id = Employee.ROWID LEFT JOIN Court ON CD.court_id = Court.ROWID WHERE CD.case_id = ${caseId}`
    };

    // Execute queries in parallel using Promise.all to minimize latency
    const keys = Object.keys(queries);
    const promises = keys.map(k => app.zcql().executeZCQLQuery(queries[k]).catch(err => {
      console.warn(`Query ${k} failed:`, err.message || err);
      return []; // return empty array if lookup fails
    }));

    const rawResults = await Promise.all(promises);
    
    const resolvedData = {};
    keys.forEach((k, idx) => {
      resolvedData[k] = flattenResults(rawResults[idx]);
    });

    const caseMasterList = resolvedData.caseMaster;
    if (!caseMasterList || caseMasterList.length === 0) {
      return sendError(res, 'NOT_FOUND', `Case with ID ${caseId} not found.`, 404);
    }

    const caseObj = caseMasterList[0];
    
    // Assemble the composite case object
    let fullCaseDetail = {
      ...caseObj,
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

    return sendSuccess(res, fullCaseDetail, {
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
      name: 'Complainant (Redacted)',
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
      name: 'Victim (Redacted)',
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
      name: a.name ? a.name.charAt(0) + '*** ' + (a.alias_name || '') : 'Accused (Redacted)',
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
