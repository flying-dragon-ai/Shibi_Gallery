import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './middlewares/logger.js';

const RETRY_DELAY_MS = 500;
const MAX_LISTEN_RETRIES = 10;

const app = createApp();
let listenRetries = 0;
let isShuttingDown = false;
let server = app.listen(env.PORT);

server.on('listening', () => {
  listenRetries = 0;
  logger.info({ port: env.PORT, pid: process.pid }, 'shibi api started');
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code !== 'EADDRINUSE' || listenRetries >= MAX_LISTEN_RETRIES) {
    logger.error({ error, port: env.PORT, pid: process.pid }, 'shibi api failed to start');
    process.exit(1);
  }

  listenRetries += 1;
  logger.warn(
    { port: env.PORT, pid: process.pid, attempt: listenRetries, maxAttempts: MAX_LISTEN_RETRIES },
    'shibi api port is busy, retrying'
  );

  server.close(() => {
    setTimeout(() => {
      if (!isShuttingDown) {
        server.listen(env.PORT);
      }
    }, RETRY_DELAY_MS);
  });
});

function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info({ signal, pid: process.pid }, 'shibi api shutting down');
  server.close((error) => {
    if (error) {
      logger.error({ error, signal, pid: process.pid }, 'shibi api shutdown failed');
      process.exit(1);
    }

    logger.info({ signal, pid: process.pid }, 'shibi api stopped');
    process.exit(0);
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
