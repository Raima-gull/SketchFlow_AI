const { z } = require('zod');

const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(120, 'Name too long')
    .trim(),
  description: z
    .string()
    .max(500, 'Description too long')
    .optional()
    .default(''),
  type: z
    .enum(['website', 'code', 'image', 'video', 'mixed'])
    .optional()
    .default('mixed'),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(120).trim().optional(),
  description: z.string().max(500).optional(),
  type: z.enum(['website', 'code', 'image', 'video', 'mixed']).optional(),
  thumbnail: z.string().optional(),
  files: z
    .array(
      z.object({
        path: z.string().min(1),
        content: z.string().default(''),
        language: z.string().default('plaintext'),
      })
    )
    .optional(),
  websiteData: z.any().optional(),
  settings: z.any().optional(),
});

const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional().default(''),
  type: z
    .enum(['website', 'code', 'image', 'video', 'mixed', 'all'])
    .optional()
    .default('all'),
  sort: z
    .enum(['createdAt', '-createdAt', 'name', '-name', 'updatedAt', '-updatedAt'])
    .optional()
    .default('-createdAt'),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  listQuerySchema,
};