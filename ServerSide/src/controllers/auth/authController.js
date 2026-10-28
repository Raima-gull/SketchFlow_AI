const { authService } = require('../../services/auth/authService');
const { tokenService } = require('../../services/auth/tokenService');
const { asyncHandler } = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const { ApiError } = require('../../utils/ApiError');

const authController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);

    const token = tokenService.sign({
      userId: user.id,
      email: user.email,
    });
    tokenService.setCookie(res, token);

    sendSuccess(res, { user }, 201);
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.login(email, password);

    const token = tokenService.sign({
      userId: user.id,
      email: user.email,
    });
    tokenService.setCookie(res, token);

    sendSuccess(res, { user });
  }),

  logout: asyncHandler(async (_req, res) => {
    tokenService.clearCookie(res);
    sendSuccess(res, { message: 'Logged out' });
  }),

  me: asyncHandler(async (req, res) => {
    if (!req.user) throw ApiError.unauthorized();
    const user = await authService.getById(req.user.id);
    sendSuccess(res, { user });
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const { name, avatar } = req.body;
    const user = await authService.updateProfile(req.user.id, { name, avatar });
    sendSuccess(res, { user });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, {
      currentPassword,
      newPassword,
    });
    sendSuccess(res, { message: 'Password updated successfully' });
  }),
};

module.exports = { authController };