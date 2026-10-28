const { Project } = require('../../models/Project');
const { ApiError } = require('../../utils/ApiError');

const projectService = {
  async create(userId, data) {
    const project = await Project.create({
      userId,
      name: data.name,
      description: data.description || '',
      type: data.type || 'mixed',
    });
    return project;
  },

  async list(userId, query) {
    const { page, limit, search, type, sort } = query;
    const skip = (page - 1) * limit;

    const filter = { userId };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    const [projects, total] = await Promise.all([
      Project.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Project.countDocuments(filter),
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getById(userId, projectId) {
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      throw ApiError.notFound('Project not found', 'PROJECT_NOT_FOUND');
    }
    return project;
  },

  async update(userId, projectId, data) {
    const project = await Project.findOneAndUpdate(
      { _id: projectId, userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!project) {
      throw ApiError.notFound('Project not found', 'PROJECT_NOT_FOUND');
    }

    return project;
  },

  async remove(userId, projectId) {
    const result = await Project.findOneAndDelete({ _id: projectId, userId });
    if (!result) {
      throw ApiError.notFound('Project not found', 'PROJECT_NOT_FOUND');
    }
    return { message: 'Project deleted' };
  },

  async duplicate(userId, projectId) {
    const original = await Project.findOne({ _id: projectId, userId });
    if (!original) {
      throw ApiError.notFound('Project not found', 'PROJECT_NOT_FOUND');
    }

    const copy = await Project.create({
      userId,
      name: `${original.name} (Copy)`,
      description: original.description,
      type: original.type,
      thumbnail: original.thumbnail,
      files: original.files,
      websiteData: original.websiteData,
      settings: original.settings,
    });

    return copy;
  },
};

module.exports = { projectService };