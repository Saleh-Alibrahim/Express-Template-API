import { Response, Request, NextFunction } from 'express';
import logger from '../config/logger';

// Create logger middleware
const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTimestamp = Date.now();
    next();
    //logger after the response
    res.on('finish', () => {
        const endTimestamp = Date.now();
        const duration = endTimestamp - startTimestamp;
        logger.debug(
            `${req.method} ${req.originalUrl} ${res.statusCode} ${
                res.statusMessage ? res.statusMessage : ''
            } - ${duration}ms`
        );
    });
};

export default logMiddleware;
