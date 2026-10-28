function sendSuccess(res, data, statusCode = 200) {
    res.status(statusCode).json({ success: true, data });
  }
  
  function sendError(res, statusCode, message, code = 'ERROR') {
    res.status(statusCode).json({ success: false, message, code });
  }
  
  module.exports = { sendSuccess, sendError };
  