const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { generationController } = require('../controllers/generations/generationController');

const router = Router();

router.use(requireAuth);

router.get('/', generationController.list);
router.get('/:id', generationController.getOne);

module.exports = router;