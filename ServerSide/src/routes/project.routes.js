const { Router } = require('express');
const { projectController } = require('../controllers/projects/projectController');
const { requireAuth } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const {
  createProjectSchema,
  updateProjectSchema,
} = require('../validators/projects/projectValidators');

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createProjectSchema), projectController.create);
router.get('/', projectController.list);
router.get('/:id', projectController.getOne);
router.patch('/:id', validateBody(updateProjectSchema), projectController.update);
router.delete('/:id', projectController.remove);
router.post('/:id/duplicate', projectController.duplicate);

module.exports = router;