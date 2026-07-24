function sendSuccess(res, data, extra = {}) {
  return res.status(200).json({
    success: true,
    data: data,
    ...extra
  });
}

function sendError(res, code, message, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}

module.exports = {
  sendSuccess,
  sendError
};
