const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { env } = require('../config/env');
const { aiController } = require('../controllers/ai/aiController');
const {
  imageGenerateSchema,
  textGenerateSchema,
  videoGenerateSchema,
} = require('../validators/ai/aiValidators');

const router = Router();

router.use(requireAuth);

// 1. PROVIDERS CHECK
router.get('/providers', (_req, res) => {
  res.json({
    success: true,
    data: {
      groq: {
        configured: Boolean(env.GROQ_API_KEY),
        capabilities: ['text', 'code'], // 👈 'code' add kiya
      },
      'magic-hour': {
        configured: Boolean(env.MAGIC_HOUR_API_KEY),
        capabilities: ['image', 'video'],
      },
    },
  });
});

// 2. IMAGE
router.post('/image/generate', validateBody(imageGenerateSchema), aiController.generateImage);
router.get('/image/:id/status', aiController.pollImage);

// 3. TEXT (Website JSON)
router.post('/text/generate', validateBody(textGenerateSchema), aiController.generateText);

// 4. CODE GENERATION (NEW)
router.post('/code/generate', aiController.generateCode); // 👈 Naya route

// 5. VIDEO
router.post('/video/generate', validateBody(videoGenerateSchema), aiController.generateVideo);
router.get('/video/:id/status', aiController.pollVideo);

module.exports = router;