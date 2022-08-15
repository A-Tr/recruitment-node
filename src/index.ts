import * as dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();

import cors from 'cors';
import express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'yamljs';
import { getEnv } from './common/Env';
import { logger } from './common/Logger';
import { errorHandler } from './common/middleware/ErrorHandler';
import { RegisterRoutes } from './common/Routes';

logger.info(`Starting server...`);
const app = express();
const port = getEnv('PORT', false) || 3000;

app.use(express.json({ strict: false }));
app.use(cors());

const swaggerDocument = yaml.load(path.join(__dirname, '../api/openapi.yaml'));
app.use(`/api/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);

app.use(errorHandler);

http.createServer(app).listen(port, function () {
  logger.info(`Your server is listening on port ${port}`);
  logger.info(`Open API is available on route api/docs`);
});

process.on('SIGTERM', () => {
  logger.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString());
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info('Got SIGINT. Graceful shutdown start', new Date().toISOString());
  process.exit(0);
});
