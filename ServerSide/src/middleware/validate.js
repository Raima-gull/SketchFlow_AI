const { ApiError } = require('../utils/ApiError');

function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const first = result.error.errors[0];
      next(
        ApiError.unprocessable(
          first?.message ?? 'Validation failed',
          'VALIDATION_ERROR'
        )
      );
      return;
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validateBody };