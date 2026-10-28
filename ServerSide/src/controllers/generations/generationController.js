const { Generation } = require('../../models/Generation');
const { asyncHandler } = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const { ApiError } = require('../../utils/ApiError');

const generationController = {
  list: asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const type = req.query.type || 'all';
    const skip = (page - 1) * limit;

    const filter = { userId: req.user.id };
    if (type !== 'all') filter.type = type;

    const [generations, total] = await Promise.all([
      Generation.find(filter).sort('-createdAt').skip(skip).limit(limit).lean(),
      Generation.countDocuments(filter),
    ]);

    sendSuccess(res, {
      generations,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }),

  getOne: asyncHandler(async (req, res) => {
    const generation = await Generation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!generation) {
      throw ApiError.notFound('Generation not found', 'GENERATION_NOT_FOUND');
    }

    sendSuccess(res, { generation });
  }),
};

module.exports = { generationController };