const { Generation } = require('../../models/Generation');
const { Media } = require('../../models/Media');
const { ApiError } = require('../../utils/ApiError');
const { magicHourVideo } = require('../../adapters/video/magicHourVideo');
const { localStorage: storage } = require('../storage/localStorage');

async function downloadAndSaveVideo(url, userId, projectId, metadata) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new ApiError(502, 'Failed to download video', 'DOWNLOAD_FAILED');
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get('content-type') || 'video/mp4';
  const ext = mimeType.split('/')[1] || 'mp4';

  const file = {
    originalname: `ai-video.${ext}`,
    mimetype: mimeType,
    size: buffer.length,
    buffer,
  };

  const { storageKey, url: publicUrl } = await storage.upload(file);

  const media = await Media.create({
    userId,
    projectId: projectId || null,
    type: 'video',
    prompt: metadata.prompt || '',
    storageProvider: 'local',
    storageKey,
    url: publicUrl,
    mimeType,
    size: buffer.length,
    metadata: {
      ...metadata,
      originalProviderUrl: url,
    },
  });

  return media;
}

const videoService = {
  async submit(userId, { prompt, projectId }) {
    const generation = await Generation.create({
      userId,
      projectId: projectId || null,
      type: 'video',
      prompt,
      provider: 'magic-hour',
      model: 'ltx-2.5',
      status: 'pending',
      parameters: { provider: 'magic-hour' },
    });

    try {
      const result = await magicHourVideo.submit({ prompt });

      generation.jobId = result.jobId;
      generation.status = 'processing';
      await generation.save();

      return { generation };
    } catch (err) {
      generation.status = 'failed';
      generation.errorCode = err.code || 'ERROR';
      generation.errorMessage = err.message;
      await generation.save();
      throw err;
    }
  },

  async pollStatus(userId, generationId) {
    const generation = await Generation.findOne({
      _id: generationId,
      userId,
    });

    if (!generation) {
      throw ApiError.notFound('Generation not found', 'GENERATION_NOT_FOUND');
    }

    if (!generation.jobId) {
      throw ApiError.badRequest('No job associated', 'NO_JOB');
    }

    if (generation.status === 'completed' || generation.status === 'failed') {
      return { generation };
    }

    const status = await magicHourVideo.pollStatus(generation.jobId);

    const isComplete = status.status === 'complete';
    const isFailed = status.status === 'error';

    if (isComplete) {
      const mediaList = [];
      for (const d of status.downloads) {
        const media = await downloadAndSaveVideo(
          d.url, 
          userId, 
          generation.projectId,
          {
            prompt: generation.prompt,
            provider: 'magic-hour',
            model: generation.model,
          }
        );
        mediaList.push(media);
      }

      generation.status = 'completed';
      generation.resultMediaIds = mediaList.map((m) => m._id);
      await generation.save();
    } else if (isFailed) {
      generation.status = 'failed';
      generation.errorCode = 'PROVIDER_FAILED';
      generation.errorMessage = status.error || 'Generation failed';
      await generation.save();
    }

    return { generation };
  },
};

module.exports = { videoService };