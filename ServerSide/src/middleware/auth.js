const { tokenService } = require('../services/auth/tokenService');
const { ApiError } = require('../utils/ApiError');

function requireAuth(req, _res, next) {
  try {
    const token = req.cookies?.[tokenService.getCookieName()];
    if (!token) {
      throw ApiError.unauthorized('Authentication required', 'NO_TOKEN');
    }

    const payload = tokenService.verify(token);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };