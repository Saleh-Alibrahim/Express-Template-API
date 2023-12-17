import 'dotenv/config';
import express from 'express';
import { handleError } from './middleware/errorHandler';
import router from './routes/index.routes';
import { connectDB } from './config/db/db';
import rateLimiter from './middleware/rateLimiter';
import {
    handleCors,
    handleNotFound,
    handleToBusyServer,
} from './middleware/mainMiddleware';
import { env } from './config/env/parseEnv';
import './types/globalType';
import hpp from 'hpp';
import helmet from 'helmet';
import logMiddleware from './middleware/logMiddleware';
import { __PROD__ } from './utils/constants';
import logger from './config/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';


const app = express();

// ============ Configuration ============
// Configure the proxy trust
app.set('trust proxy', Number(env.TRUST_PROXY_COUNT));


// ============ Methods ============
// Connect to the database
connectDB();

// ============ Middleware ============
// Add logger
app.use(logMiddleware);
// Accept json requests
app.use(express.json());
// Add helmet security headers
app.use(
    helmet({
        contentSecurityPolicy: __PROD__,
    })
);
//  Hide the server details from the response headers
app.use(hpp());
// If server is too busy, return 503
app.use(handleToBusyServer);
// Add rate limiter
app.use(rateLimiter);
// Add cors
app.use(handleCors());
// Add the main router
app.use('/api/v1', router);
// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Catch 404 to route does not exist and forward it to the error handler
app.use(handleNotFound);
// Handle all the errors
app.use(handleError);




const PORT = env.PORT || 5000;

app.listen(PORT, () => logger.info(`Server Running at ${PORT}`));
