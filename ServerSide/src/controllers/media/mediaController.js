const { mediaService } = require('../../services/media/mediaService');
const { asyncHandler } = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

const mediaController = {
  upload: asyncHandler(async (req, res) => {
    const media = await mediaService.upload(req.user.id, req.file, {
      projectId: req.body.projectId,
      prompt: req.body.prompt,
    });
    sendSuccess(res, { media }, 201);
  }),

  list: asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const type = req.query.type || 'all';
    const projectId = req.query.projectId || null;

    const result = await mediaService.list(req.user.id, { page, limit, type, projectId });
    sendSuccess(res, result);
  }),

  getOne: asyncHandler(async (req, res) => {
    const media = await mediaService.getById(req.user.id, req.params.id);
    sendSuccess(res, { media });
  }),

  remove: asyncHandler(async (req, res) => {
    const result = await mediaService.remove(req.user.id, req.params.id);
    sendSuccess(res, result);
  }),
};

module.exports = { mediaController };