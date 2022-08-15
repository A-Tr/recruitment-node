import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import * as yaml from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as http from 'http';
import { RegisterRoutes } from './common/Routes';
import { logger } from './common/Logger';
import { getEnv } from './common/Env';
import { errorHandler } from './common/middleware/ErrorHandler';

logger.info(`Starting server...`);
const app = express();
const port = getEnv('PORT', false) || 3000;

app.use(express.json({ strict: false }))
app.use(cors());
const swaggerDocument = yaml.load(path.join(__dirname, '../api/openapi.yaml'));
app.use(`/api/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);
app.use(errorHandler);

http.createServer(app).listen(port, function () {
  logger.info(`Your server is listening on port ${port}`);
  logger.info(`Open API is available on route api/docs`);
});
