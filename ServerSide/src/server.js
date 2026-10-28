const app = require('./app');
const { env } = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const { logger } = require('./config/logger');

async function bootstrap() {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running: http://localhost:${env.PORT}`);
    logger.info(`🌍 Environment: ${env.NODE_ENV}`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});