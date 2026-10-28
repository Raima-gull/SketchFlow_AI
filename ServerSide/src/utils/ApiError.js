class ApiError extends Error {
    constructor(statusCode, message, code = 'ERROR') {
      super(message);
      this.statusCode = statusCode;
      this.code = code;
      this.name = 'ApiError';
      Error.captureStackTrace(this, this.constructor);
    }
  
    static badRequest(msg, code = 'BAD_REQUEST') {
      return new ApiError(400, msg, code);
    }
    static unauthorized(msg = 'Unauthorized', code = 'UNAUTHORIZED') {
      return new ApiError(401, msg, code);
    }
    static forbidden(msg = 'Forbidden', code = 'FORBIDDEN') {
      return new ApiError(403, msg, code);
    }
    static notFound(msg = 'Not found', code = 'NOT_FOUND') {
      return new ApiError(404, msg, code);
    }
    static conflict(msg, code = 'CONFLICT') {
      return new ApiError(409, msg, code);
    }
    static unprocessable(msg, code = 'UNPROCESSABLE') {
      return new ApiError(422, msg, code);
    }
    static internal(msg = 'Internal server error', code = 'INTERNAL_ERROR') {
      return new ApiError(500, msg, code);
    }
  }
  
  module.exports = { ApiError };