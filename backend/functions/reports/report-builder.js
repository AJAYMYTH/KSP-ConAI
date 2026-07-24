const fs = require('fs');
const path = require('path');
const { executeQuery, escapeString, generateCaseSummary, getCatalystApp } = require('../shared');

async function buildReport(req, caseId, userContext) {
  const app = getCatalystApp(req);
  
  const caseSql = `SELECT CaseMaster.ROWID, CaseMaster.fir_number, CaseMaster.crime_registered_date, CaseMaster.incident_from_date, CaseMaster.place_of_occurrence, CaseMaster.summary_of_facts, 
                   District.district_name, Unit.unit_name, CaseCategory.category_name, GravityOffence.gravity_name 
                   FROM CaseMaster 
                   LEFT JOIN District ON CaseMaster.district_id = District.ROWID 
                   LEFT JOIN Unit ON CaseMaster.unit_id = Unit.ROWID 
                   LEFT JOIN CaseCategory ON CaseMaster.case_category_id = CaseCategory.ROWID 
                   LEFT JOIN GravityOffence ON CaseMaster.gravity_offence_id = GravityOffence.ROWID 
                   WHERE CaseMaster.ROWID = ${escapeString(caseId)}`;
                   
  const caseRows = await executeQuery(req, caseSql);
  if (caseRows.length === 0) {
    throw new Error('Case not found');
  }
  
  const caseData = {
    ROWID: caseRows[0].CaseMaster.ROWID,
    fir_number: caseRows[0].CaseMaster.fir_number,
    crime_registered_date: caseRows[0].CaseMaster.crime_registered_date,
    incident_from_date: caseRows[0].CaseMaster.incident_from_date,
    place_of_occurrence: caseRows[0].CaseMaster.place_of_occurrence,
    summary_of_facts: caseRows[0].CaseMaster.summary_of_facts,
    district_name: caseRows[0].District?.district_name || 'N/A',
    unit_name: caseRows[0].Unit?.unit_name || 'N/A',
    category_name: caseRows[0].CaseCategory?.category_name || 'N/A',
    gravity_name: caseRows[0].GravityOffence?.gravity_name || 'N/A'
  };
  
  const [compRows, vicRows, accRows, secRows, arrRows] = await Promise.all([
    executeQuery(req, `SELECT name, age, gender, phone, address FROM ComplainantDetails WHERE case_id = ${escapeString(caseId)}`),
    executeQuery(req, `SELECT name, age, gender, injury_type, phone, address FROM Victim WHERE case_id = ${escapeString(caseId)}`),
    executeQuery(req, `SELECT name, alias_name, age, gender, status, address FROM Accused WHERE case_id = ${escapeString(caseId)}`),
    executeQuery(req, `SELECT Act.act_name, Section.section_number, Section.section_description FROM ActSectionAssociation LEFT JOIN Act ON ActSectionAssociation.act_id = Act.ROWID LEFT JOIN Section ON ActSectionAssociation.section_id = Section.ROWID WHERE ActSectionAssociation.case_id = ${escapeString(caseId)}`),
    executeQuery(req, `SELECT Accused.name AS accused_name, ArrestSurrender.event_type, ArrestSurrender.date_time, ArrestSurrender.place, ArrestSurrender.remarks FROM ArrestSurrender LEFT JOIN Accused ON ArrestSurrender.accused_id = Accused.ROWID WHERE ArrestSurrender.case_id = ${escapeString(caseId)}`)
  ]);

  const aiSummary = await generateCaseSummary(req, caseData);

  const complainantsHtml = formatTable(
    ['Name', 'Age', 'Gender', 'Phone', 'Address'],
    compRows.map(r => r.ComplainantDetails),
    ['name', 'age', 'gender', 'phone', 'address']
  );

  const victimsHtml = formatTable(
    ['Name', 'Age', 'Gender', 'Injury Type', 'Phone', 'Address'],
    vicRows.map(r => r.Victim),
    ['name', 'age', 'gender', 'injury_type', 'phone', 'address']
  );

  const accusedHtml = formatTable(
    ['Name', 'Alias', 'Age', 'Gender', 'Status', 'Address'],
    accRows.map(r => r.Accused),
    ['name', 'alias_name', 'age', 'gender', 'status', 'address']
  );

  const actsSectionsHtml = formatTable(
    ['Act', 'Section Number', 'Description'],
    secRows.map(r => ({
      act_name: r.Act?.act_name || 'N/A',
      section_number: r.Section?.section_number || 'N/A',
      section_description: r.Section?.section_description || 'N/A'
    })),
    ['act_name', 'section_number', 'section_description']
  );

  const arrestsHtml = formatTable(
    ['Accused Name', 'Event Type', 'Date/Time', 'Place', 'Remarks'],
    arrRows.map(r => ({
      accused_name: r.Accused?.accused_name || 'N/A',
      event_type: r.ArrestSurrender?.event_type || 'N/A',
      date_time: r.ArrestSurrender?.date_time ? new Date(r.ArrestSurrender.date_time).toLocaleString('en-IN') : 'N/A',
      place: r.ArrestSurrender?.place || 'N/A',
      remarks: r.ArrestSurrender?.remarks || 'N/A'
    })),
    ['accused_name', 'event_type', 'date_time', 'place', 'remarks']
  );

  const templatePath = path.join(__dirname, 'template', 'report.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const registeredDate = caseData.crime_registered_date ? new Date(caseData.crime_registered_date).toLocaleDateString('en-IN') : 'N/A';
  
  html = html
    .replace(/\{\{fir_number\}\}/g, caseData.fir_number || 'N/A')
    .replace(/\{\{crime_registered_date\}\}/g, registeredDate)
    .replace(/\{\{district\}\}/g, caseData.district_name)
    .replace(/\{\{station\}\}/g, caseData.unit_name)
    .replace(/\{\{category\}\}/g, caseData.category_name)
    .replace(/\{\{gravity\}\}/g, caseData.gravity_name)
    .replace(/\{\{place_of_occurrence\}\}/g, caseData.place_of_occurrence || 'N/A')
    .replace(/\{\{summary_of_facts\}\}/g, caseData.summary_of_facts || 'N/A')
    .replace(/\{\{ai_summary\}\}/g, aiSummary)
    .replace(/\{\{complainants\}\}/g, complainantsHtml)
    .replace(/\{\{victims\}\}/g, victimsHtml)
    .replace(/\{\{accused\}\}/g, accusedHtml)
    .replace(/\{\{acts_sections\}\}/g, actsSectionsHtml)
    .replace(/\{\{arrests\}\}/g, arrestsHtml)
    .replace(/\{\{generated_at\}\}/g, new Date().toLocaleString('en-IN'));

  console.log(`Rendering PDF for case ${caseId} via SmartBrowz...`);
  const pdfStream = await app.smartbrowz().convertToPdf(html, {
    pdf_options: {
      format: 'A4',
      print_background: true,
      margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' }
    }
  });

  const pdfBuffer = await streamToBuffer(pdfStream);

  let bucket;
  const stratus = app.stratus();
  try {
    const buckets = await stratus.listBuckets();
    if (buckets && buckets.length > 0) {
      bucket = buckets.find(b => b.getName() === 'reports') || buckets[0];
    } else {
      bucket = stratus.bucket('reports');
    }
  } catch (err) {
    console.warn('Could not list Stratus buckets, default to bucket "reports":', err.message);
    bucket = stratus.bucket('reports');
  }

  const safeFirNumber = (caseData.fir_number || 'UNKNOWN').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `reports/FIR_${safeFirNumber}_${Date.now()}.pdf`;
  
  console.log(`Uploading PDF to Stratus as: ${filename}...`);
  await bucket.putObject(filename, pdfBuffer, {
    contentType: 'application/pdf',
    overwrite: true
  });

  const urlRes = await bucket.generatePreSignedUrl(filename, 'GET', { expiryIn: 3600 });
  const downloadUrl = urlRes.url || urlRes.pre_signed_url;

  const reportName = `Intelligence_Report_FIR_${caseData.fir_number}.pdf`;
  console.log(`Logging report in GeneratedReports table...`);
  const reportTable = app.datastore().table('GeneratedReports');
  const reportRecord = {
    case_id: caseData.ROWID,
    report_name: reportName,
    file_path: filename,
    file_url: downloadUrl,
    created_time: new Date().toISOString(),
    generated_by: userContext.email || 'system'
  };
  
  const insertRes = await reportTable.insertRow(reportRecord);

  return {
    reportId: insertRes.ROWID,
    caseId: caseData.ROWID,
    firNumber: caseData.fir_number,
    reportName,
    filePath: filename,
    fileUrl: downloadUrl,
    createdTime: reportRecord.created_time,
    generatedBy: reportRecord.generated_by
  };
}

function formatTable(headers, rows, keys) {
  if (!rows || rows.length === 0) {
    return '<p style="font-size: 12px; color: #777; font-style: italic;">No records found for this section.</p>';
  }
  
  let html = '<table class="data-table"><thead><tr>';
  headers.forEach(h => {
    html += `<th>${h}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  rows.forEach(r => {
    html += '<tr>';
    keys.forEach(k => {
      html += `<td>${r[k] !== undefined && r[k] !== null ? r[k] : 'N/A'}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  return html;
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', err => reject(err));
  });
}

module.exports = {
  buildReport
};
