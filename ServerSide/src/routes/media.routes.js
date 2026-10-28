const { Router } = require('express');
const { mediaController } = require('../controllers/media/mediaController');
const { requireAuth } = require('../middleware/auth');
const { handleUpload } = require('../middleware/upload');

const router = Router();

router.use(requireAuth);

router.post('/upload', handleUpload, mediaController.upload);
router.get('/', mediaController.list);
router.get('/:id', mediaController.getOne);
router.delete('/:id', mediaController.remove);

module.exports = router;