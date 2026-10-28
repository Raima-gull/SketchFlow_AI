const { z } = require('zod');

const imageGenerateSchema = z.object({
  prompt: z.string().min(3, 'Prompt too short').max(2000),
  provider: z.enum(['openai', 'replicate', 'magic-hour']).optional(),
  projectId: z.string().optional(), // 👈 Ye add karo
});

const textGenerateSchema = z.object({
  prompt: z.string().min(5, 'Prompt too short').max(2000),
});

const videoGenerateSchema = z.object({
  prompt: z.string().min(3, 'Prompt too short').max(2000),
  provider: z.enum(['replicate', 'magic-hour']).optional(),
  projectId: z.string().optional(), // 👈 Ye add karo
});

module.exports = {
  imageGenerateSchema,
  textGenerateSchema,
  videoGenerateSchema,
};