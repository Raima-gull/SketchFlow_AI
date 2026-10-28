// const { Generation } = require('../../models/Generation');
// const { Media } = require('../../models/Media');
// const { ApiError } = require('../../utils/ApiError');
// const { magicHourImage } = require('../../adapters/image/magicHourImage');
// const { localStorage: storage } = require('../storage/localStorage');

// async function downloadAndSave(url, userId, projectId, metadata) {
//   const res = await fetch(url);
//   if (!res.ok) throw new ApiError(502, 'Failed to download image', 'DOWNLOAD_FAILED');

//   const buffer = Buffer.from(await res.arrayBuffer());
//   const mimeType = res.headers.get('content-type') || 'image/png';
//   const ext = mimeType.split('/')[1] || 'png';

//   const file = {
//     originalname: `ai-image.${ext}`,
//     mimetype: mimeType,
//     size: buffer.length,
//     buffer,
//   };

//   const { storageKey, url: publicUrl } = await storage.upload(file);

//   const media = await Media.create({
//     userId,
//     projectId: projectId || null, // 👈 Yahan save ho rahi hai
//     type: 'image',
//     prompt: metadata.prompt || '',
//     storageProvider: 'local',
//     storageKey,
//     url: publicUrl,
//     mimeType,
//     size: buffer.length,
//     metadata: { ...metadata, originalProviderUrl: url },
//   });

//   return media;
// }

// const imageService = {
//   async generate(userId, { prompt, projectId }) {
//     console.log('🔍 Service received projectId:', projectId); // 👈 Debugging

//     const generation = await Generation.create({
//       userId,
//       projectId: projectId || null, // 👈 Generation mein save
//       type: 'image',
//       prompt,
//       provider: 'magic-hour',
//       model: 'z-image-turbo',
//       status: 'processing',
//       parameters: { provider: 'magic-hour' },
//     });

//     try {
//       const result = await magicHourImage.submit({ prompt });
//       generation.jobId = result.jobId;
//       generation.status = 'processing';
//       await generation.save();
//       return { generation, media: [] };
//     } catch (err) {
//       generation.status = 'failed';
//       generation.errorCode = err.code || 'ERROR';
//       generation.errorMessage = err.message || 'Unknown error';
//       await generation.save();
//       throw err;
//     }
//   },

//   async pollStatus(userId, generationId) {
//     const generation = await Generation.findOne({ _id: generationId, userId });

//     if (!generation) throw ApiError.notFound('Generation not found', 'GENERATION_NOT_FOUND');
//     if (generation.status === 'completed' || generation.status === 'failed') return { generation };

//     const status = await magicHourImage.pollStatus(generation.jobId);

//     if (status.status === 'complete') {
//       const mediaList = [];
//       for (const d of status.downloads) {
//         const media = await downloadAndSave(
//           d.url, 
//           userId, 
//           generation.projectId, // 👈 Yahan pass ho rahi hai
//           { prompt: generation.prompt, provider: 'magic-hour', model: 'z-image-turbo' }
//         );
//         mediaList.push(media);
//       }

//       generation.status = 'completed';
//       generation.resultMediaIds = mediaList.map((m) => m._id);
//       await generation.save();

//       return { generation, media: mediaList };
//     }

//     if (status.status === 'error') {
//       generation.status = 'failed';
//       generation.errorCode = 'PROVIDER_FAILED';
//       generation.errorMessage = status.error || 'Unknown error';
//       await generation.save();
//     }

//     return { generation };
//   },
// };

// module.exports = { imageService };

const { Generation } = require('../../models/Generation');
const { Media } = require('../../models/Media');
const { ApiError } = require('../../utils/ApiError');
const { magicHourImage } = require('../../adapters/image/magicHourImage');
const { localStorage: storage } = require('../storage/localStorage');

async function downloadAndSave(url, userId, projectId, metadata) {
  const res = await fetch(url);
  if (!res.ok) throw new ApiError(502, 'Failed to download image', 'DOWNLOAD_FAILED');

  const buffer = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get('content-type') || 'image/png';
  const ext = mimeType.split('/')[1] || 'png';

  const file = {
    originalname: `ai-image.${ext}`,
    mimetype: mimeType,
    size: buffer.length,
    buffer,
  };

  const { storageKey, url: publicUrl } = await storage.upload(file);

  // 👇 Yahan projectId pakka save hoga
  const media = await Media.create({
    userId: userId,
    projectId: projectId ? projectId : null, // 👈
    type: 'image',
    prompt: metadata.prompt || '',
    storageProvider: 'local',
    storageKey,
    url: publicUrl,
    mimeType,
    size: buffer.length,
    metadata: { ...metadata, originalProviderUrl: url },
  });

  console.log('✅ Media created with projectId:', media.projectId);
  return media;
}

const imageService = {
  async generate(userId, { prompt, projectId }) {
    console.log('🚀🚀🚀 Image Service - ProjectID:', projectId);

    // 👇 Generation save karo
    const generation = await Generation.create({
      userId,
      projectId: projectId ? projectId : null, // 👈
      type: 'image',
      prompt,
      provider: 'magic-hour',
      model: 'z-image-turbo',
      status: 'processing',
      parameters: { provider: 'magic-hour' },
    });

    try {
      const result = await magicHourImage.submit({ prompt });
      generation.jobId = result.jobId;
      generation.status = 'processing';
      await generation.save();
      return { generation, media: [] };
    } catch (err) {
      generation.status = 'failed';
      generation.errorCode = err.code || 'ERROR';
      generation.errorMessage = err.message || 'Unknown error';
      await generation.save();
      throw err;
    }
  },

  async pollStatus(userId, generationId) {
    const generation = await Generation.findOne({ _id: generationId, userId });

    if (!generation) throw ApiError.notFound('Generation not found', 'GENERATION_NOT_FOUND');
    if (generation.status === 'completed' || generation.status === 'failed') return { generation };

    const status = await magicHourImage.pollStatus(generation.jobId);

    if (status.status === 'complete') {
      const mediaList = [];
      for (const d of status.downloads) {
        // 👇 Yahan Generation ka projectId pass karo
        const media = await downloadAndSave(
          d.url,
          userId,
          generation.projectId,
          { prompt: generation.prompt, provider: 'magic-hour', model: 'z-image-turbo' }
        );
        mediaList.push(media);
      }

      generation.status = 'completed';
      generation.resultMediaIds = mediaList.map((m) => m._id);
      await generation.save();

      return { generation, media: mediaList };
    }

    if (status.status === 'error') {
      generation.status = 'failed';
      generation.errorCode = 'PROVIDER_FAILED';
      generation.errorMessage = status.error || 'Unknown error';
      await generation.save();
    }

    return { generation };
  },
};

module.exports = { imageService };