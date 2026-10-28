const { Media } = require('../../models/Media');
const { ApiError } = require('../../utils/ApiError');
const { localStorage: storage } = require('../storage/localStorage');

function detectType(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'other';
}

const mediaService = {
  async upload(userId, file, meta = {}) {
    if (!file) {
      throw ApiError.badRequest('No file uploaded', 'NO_FILE');
    }

    const { storageKey, url } = await storage.upload(file);
    const type = detectType(file.mimetype);

    const media = await Media.create({
      userId,
      projectId: meta.projectId || null,
      type,
      prompt: meta.prompt || '',
      storageProvider: 'local',
      storageKey,
      url,
      mimeType: file.mimetype,
      size: file.size,
      metadata: {
        originalName: file.originalname,
      },
    });

    return media;
  },

  async list(userId, query) {
    const { page, limit, type, projectId } = query;
    const skip = (page - 1) * limit;

    const filter = { userId };
    if (type && type !== 'all') {
      filter.type = type;
    }
    if (projectId) {
      filter.projectId = projectId;
    }

    const [media, total] = await Promise.all([
      Media.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Media.countDocuments(filter),
    ]);

    return {
      media,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getById(userId, mediaId) {
    const media = await Media.findOne({ _id: mediaId, userId });
    if (!media) {
      throw ApiError.notFound('Media not found', 'MEDIA_NOT_FOUND');
    }
    return media;
  },

  async remove(userId, mediaId) {
    const media = await Media.findOne({ _id: mediaId, userId });
    if (!media) {
      throw ApiError.notFound('Media not found', 'MEDIA_NOT_FOUND');
    }

    if (media.storageProvider === 'local') {
      await storage.delete(media.storageKey);
    }

    await Media.deleteOne({ _id: media._id });
    return { message: 'Media deleted' };
  },
};

module.exports = { mediaService };