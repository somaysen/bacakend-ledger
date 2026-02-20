import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      logger.info(`Server listening on port http://localhost:${env.port}`);
    });
  } catch (error) {
    logger.error("internal Server error",error),
    process.exit(1);
  }
}

bootstrap();
