import rateLimit from 'express-rate-limit';
import ms from 'ms';
import { env } from '../config/env/parseEnv';

const rateLimiter = rateLimit({
    windowMs: ms(env.API_RATE_LIMIT_TIME),
    max: Number(env.API_RATE_LIMIT_COUNT),
    message: 'You have exceeded the rate limit !',

    standardHeaders: true,
});

export default rateLimiter;
