const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema(
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
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video'],
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    provider: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    parameters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    resultMediaIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
    jobId: {
      type: String,
      default: '',
    },
    errorCode: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

generationSchema.index({ userId: 1, createdAt: -1 });
generationSchema.index({ userId: 1, status: 1 });

const Generation = mongoose.model('Generation', generationSchema);

module.exports = { Generation };