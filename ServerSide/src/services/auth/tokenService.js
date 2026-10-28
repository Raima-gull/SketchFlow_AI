const jwt = require('jsonwebtoken');
const { env } = require('../../config/env');
const { ApiError } = require('../../utils/ApiError');

const COOKIE_NAME = 'auth_token';
const EXPIRES_IN = '7d';

const tokenService = {
  sign(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: EXPIRES_IN });
  },

  verify(token) {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch {
      throw ApiError.unauthorized('Invalid or expired token', 'INVALID_TOKEN');
    }
  },

  setCookie(res, token) {
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  },

  clearCookie(res) {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  },

  getCookieName() {
    return COOKIE_NAME;
  },
};

module.exports = { tokenService };