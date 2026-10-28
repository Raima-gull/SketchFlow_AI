const bcrypt = require('bcrypt');
const { User } = require('../../models/User');
const { ApiError } = require('../../utils/ApiError');

const SALT_ROUNDS = 12;

const authService = {
  async register(name, email, password) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw ApiError.conflict('Email already registered', 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return User.create({ name, email, passwordHash });
  },

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw ApiError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    return user;
  },

  async getById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }
    return user;
  },

  async updateProfile(userId, { name, avatar }) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }

    if (name !== undefined) {
      if (!name || name.trim().length < 2) {
        throw ApiError.badRequest(
          'Name must be at least 2 characters',
          'INVALID_NAME'
        );
      }
      user.name = name.trim();
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();
    return user;
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw ApiError.badRequest(
        'Both current and new password are required',
        'MISSING_PASSWORDS'
      );
    }

    if (newPassword.length < 8) {
      throw ApiError.badRequest(
        'New password must be at least 8 characters',
        'WEAK_PASSWORD'
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      throw ApiError.unauthorized(
        'Current password is incorrect',
        'WRONG_PASSWORD'
      );
    }

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();
    return user;
  },
};

module.exports = { authService };