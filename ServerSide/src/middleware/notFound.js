const { ApiError } = require('../utils/ApiError');

function notFound(req, _res, next) {
  next(
    ApiError.notFound(
      `Route ${req.method} ${req.path} not found`,
      'ROUTE_NOT_FOUND'
    )
  );
}

module.exports = { notFound };