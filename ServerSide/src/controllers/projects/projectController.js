const { projectService } = require('../../services/projects/projectService');
const { asyncHandler } = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');

const projectController = {
  create: asyncHandler(async (req, res) => {
    const project = await projectService.create(req.user.id, req.body);
    sendSuccess(res, { project }, 201);
  }),

  list: asyncHandler(async (req, res) => {
    const result = await projectService.list(req.user.id, req.query);
    sendSuccess(res, result);
  }),

  getOne: asyncHandler(async (req, res) => {
    const project = await projectService.getById(req.user.id, req.params.id);
    sendSuccess(res, { project });
  }),

  update: asyncHandler(async (req, res) => {
    const project = await projectService.update(
      req.user.id,
      req.params.id,
      req.body
    );
    sendSuccess(res, { project });
  }),

  remove: asyncHandler(async (req, res) => {
    const result = await projectService.remove(req.user.id, req.params.id);
    sendSuccess(res, result);
  }),

  duplicate: asyncHandler(async (req, res) => {
    const project = await projectService.duplicate(req.user.id, req.params.id);
    sendSuccess(res, { project }, 201);
  }),
};

module.exports = { projectController };