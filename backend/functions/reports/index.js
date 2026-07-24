const express = require('express');
const { checkRole, sendSuccess, sendError, executeQuery } = require('../shared');
const { buildReport } = require('./report-builder');

const app = express();
app.use(express.json());

const handleReportGen = async (req, res) => {
  const caseId = req.params.caseId;
  const userContext = req.user;
  
  if (!caseId) {
    return sendError(res, 'MISSING_PARAM', 'Case ID is required.');
  }
  
  try {
    const reportData = await buildReport(req, caseId, userContext);
    return sendSuccess(res, reportData);
  } catch (err) {
    console.error('Error generating report:', err.message || err);
    if (err.message === 'Case not found') {
      return sendError(res, 'NOT_FOUND', 'Case not found.', 404);
    }
    return sendError(res, 'REPORT_GENERATION_FAILED', `Failed to generate PDF report: ${err.message}`);
  }
};

app.post('/reports/case/:caseId', checkRole(['admin', 'investigator', 'analyst']), handleReportGen);
app.post('/case/:caseId', checkRole(['admin', 'investigator', 'analyst']), handleReportGen);
app.post('/:caseId', checkRole(['admin', 'investigator', 'analyst']), handleReportGen);

const handleReportHistory = async (req, res) => {
  try {
    const sql = `SELECT GeneratedReports.ROWID, GeneratedReports.case_id, GeneratedReports.report_name, GeneratedReports.file_path, GeneratedReports.file_url, GeneratedReports.created_time, GeneratedReports.generated_by, CaseMaster.fir_number 
                 FROM GeneratedReports 
                 LEFT JOIN CaseMaster ON GeneratedReports.case_id = CaseMaster.ROWID 
                 ORDER BY GeneratedReports.created_time DESC`;
                 
    const rows = await executeQuery(req, sql);
    
    const items = rows.map(r => ({
      rowId: r.GeneratedReports.ROWID,
      caseId: r.GeneratedReports.case_id,
      firNumber: r.CaseMaster?.fir_number || 'N/A',
      reportName: r.GeneratedReports.report_name,
      filePath: r.GeneratedReports.file_path,
      fileUrl: r.GeneratedReports.file_url,
      createdTime: r.GeneratedReports.created_time,
      generatedBy: r.GeneratedReports.generated_by
    }));
    
    return sendSuccess(res, items);
  } catch (err) {
    console.error('Error reading reports history:', err.message || err);
    return sendError(res, 'DB_ERROR', 'Failed to retrieve report generation history.');
  }
};

app.get('/reports/history', checkRole(['admin', 'investigator', 'analyst']), handleReportHistory);
app.get('/history', checkRole(['admin', 'investigator', 'analyst']), handleReportHistory);

module.exports = app;
