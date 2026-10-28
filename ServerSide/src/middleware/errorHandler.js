const { ZodError } = require('zod');
const { ApiError } = require('../utils/ApiError');
const { logger } = require('../config/logger');
const { sendError } = require('../utils/apiResponse');

function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.message, err.code);
    return;
  }

  if (err instanceof ZodError) {
    const first = err.errors[0];
    sendError(res, 422, first?.message ?? 'Validation failed', 'VALIDATION_ERROR');
    return;
  }

  logger.error({ err }, 'Unhandled error');
  sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR');
}

module.exports = { errorHandler };