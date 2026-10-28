const mongoose = require('mongoose');
const { env } = require('./env');
const { logger } = require('./logger');

async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGODB_URI);
    logger.info(`✅ MongoDB connected: ${mongoose.connection.name}`);

    mongoose.connection.on('error', (err) =>
      logger.error({ err }, 'MongoDB error')
    );
    mongoose.connection.on('disconnected', () =>
      logger.warn('MongoDB disconnected')
    );
  } catch (err) {
    logger.error({ err }, '❌ MongoDB connection failed');
    process.exit(1);
  }
}

async function disconnectDB() {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}

module.exports = { connectDB, disconnectDB };