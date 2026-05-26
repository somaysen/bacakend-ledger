import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const port = env.port;

async function bootstrap() {
  try {
    await connectDatabase();
    const server = app.listen(port, () => {
      logger.info(`Server listening at http://localhost:${port}`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down server.`);
      server.close(() => {
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

bootstrap();
