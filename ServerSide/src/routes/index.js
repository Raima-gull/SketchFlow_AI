const { Router } = require('express');
const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');
const mediaRoutes = require('./media.routes');
const aiRoutes = require('./ai.routes');
const generationRoutes = require('./generations.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/media', mediaRoutes);
router.use('/ai', aiRoutes);
router.use('/generations', generationRoutes);

module.exports = router;