const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ['image', 'video', 'other'],
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    storageProvider: {
      type: String,
      enum: ['local', 'cloudinary', 's3'],
      default: 'local',
    },
    storageKey: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

mediaSchema.index({ userId: 1, createdAt: -1 });
mediaSchema.index({ userId: 1, type: 1 });

const Media = mongoose.model('Media', mediaSchema);

module.exports = { Media };