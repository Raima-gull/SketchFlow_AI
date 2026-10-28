const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    type: {
      type: String,
      enum: ['website', 'code', 'image', 'video', 'mixed'],
      default: 'mixed',
      index: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    files: [
      {
        path: { type: String, required: true },
        content: { type: String, default: '' },
        language: { type: String, default: 'plaintext' },
      },
    ],
    websiteData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, name: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = { Project };