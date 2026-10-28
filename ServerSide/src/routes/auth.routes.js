const { Router } = require('express');
const { authController } = require('../controllers/auth/authController');
const { validateBody } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const {
  registerSchema,
  loginSchema,
} = require('../validators/auth/authValidators');

const router = Router();

// ── Public routes ──────────────────────────────
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register
);
router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login
);
router.post('/logout', authController.logout);

// ── Protected routes ───────────────────────────
router.get('/me', requireAuth, authController.me);
router.patch('/profile', requireAuth, authController.updateProfile);
router.patch('/password', requireAuth, authController.changePassword);

module.exports = router;