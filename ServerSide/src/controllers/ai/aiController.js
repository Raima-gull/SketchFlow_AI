

// const { imageService } = require('../../services/ai/imageService');
// const { textService } = require('../../services/ai/textService');
// const { videoService } = require('../../services/ai/videoService');
// const { asyncHandler } = require('../../utils/asyncHandler');
// const { sendSuccess } = require('../../utils/apiResponse');

// const aiController = {
//   generateImage: asyncHandler(async (req, res) => {
//     // 👇 Debugging (screenshot mein ye dikhna chahiye)
//     console.log('🔥🔥🔥 RAW BODY:', JSON.stringify(req.body));

//     const prompt = req.body.prompt;
//     const projectId = req.body.projectId; // 👈 Direct nikalo

//     console.log('🔥🔥🔥 PROMPT:', prompt);
//     console.log('🔥🔥🔥 PROJECT ID:', projectId);

//     // 👇 Service ko explicitly bhejo
//     const result = await imageService.generate(req.user.id, {
//       prompt: prompt,
//       projectId: projectId || null,
//     });

//     sendSuccess(res, result, 201);
//   }),

//   pollImage: asyncHandler(async (req, res) => {
//     const result = await imageService.pollStatus(req.user.id, req.params.id);
//     sendSuccess(res, result);
//   }),

//   generateText: asyncHandler(async (req, res) => {
//     const result = await textService.generateWebsite(req.user.id, req.body);
//     sendSuccess(res, result, 201);
//   }),

//   generateVideo: asyncHandler(async (req, res) => {
//     const prompt = req.body.prompt;
//     const projectId = req.body.projectId;

//     const result = await videoService.submit(req.user.id, {
//       prompt: prompt,
//       projectId: projectId || null,
//     });
//     sendSuccess(res, result, 201);
//   }),

//   pollVideo: asyncHandler(async (req, res) => {
//     const result = await videoService.pollStatus(req.user.id, req.params.id);
//     sendSuccess(res, result);
//   }),
// };

// module.exports = { aiController };



const { imageService } = require('../../services/ai/imageService');
const { textService } = require('../../services/ai/textService');
const { videoService } = require('../../services/ai/videoService');
const { asyncHandler } = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const { ApiError } = require('../../utils/ApiError');

const aiController = {
  // --- IMAGE ---
  generateImage: asyncHandler(async (req, res) => {
    console.log('🔥🔥🔥 RAW BODY:', JSON.stringify(req.body));

    const prompt = req.body.prompt;
    const projectId = req.body.projectId;

    console.log('🔥🔥🔥 PROMPT:', prompt);
    console.log('🔥🔥🔥 PROJECT ID:', projectId);

    const result = await imageService.generate(req.user.id, {
      prompt: prompt,
      projectId: projectId || null,
    });

    sendSuccess(res, result, 201);
  }),

  pollImage: asyncHandler(async (req, res) => {
    const result = await imageService.pollStatus(req.user.id, req.params.id);
    sendSuccess(res, result);
  }),

  // --- TEXT (WEBSITE JSON) ---
  generateText: asyncHandler(async (req, res) => {
    const result = await textService.generateWebsite(req.user.id, req.body);
    sendSuccess(res, result, 201);
  }),

  // --- CODE GENERATION (LANGUAGE-STRICT) ---
  generateCode: asyncHandler(async (req, res) => {
    const { prompt, language, projectId } = req.body;

    console.log('💻 CODE REQUEST:', { prompt, language, projectId });

    if (!prompt || prompt.trim().length < 5) {
      throw new ApiError(400, 'Prompt too short.');
    }

    const result = await textService.generateCode(req.user.id, {
      prompt: prompt.trim(),
      language: language || 'auto',
      projectId: projectId || null,
    });

    sendSuccess(
      res,
      {
        language: result.language,
        action: result.action,
        code: result.code,
        generationId: result.generation?._id,
      },
      201
    );
  }),

  // --- VIDEO ---
  generateVideo: asyncHandler(async (req, res) => {
    const prompt = req.body.prompt;
    const projectId = req.body.projectId;

    const result = await videoService.submit(req.user.id, {
      prompt: prompt,
      projectId: projectId || null,
    });
    sendSuccess(res, result, 201);
  }),

  pollVideo: asyncHandler(async (req, res) => {
    const result = await videoService.pollStatus(req.user.id, req.params.id);
    sendSuccess(res, result);
  }),
};

module.exports = { aiController };