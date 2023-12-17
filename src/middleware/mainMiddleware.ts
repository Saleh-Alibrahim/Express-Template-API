import { NextFunction, Request, Response } from 'express';
import { BaseError } from './errorHandler';
import { HttpErrorMessage, HttpStatusCode } from '../utils/http';
import toobusy from 'toobusy-js';
import contentSecurityPolicy from 'helmet-csp';
import { env } from '../config/env/parseEnv';
import cors from 'cors';
import { __DEV__ } from '../utils/constants';

export const handleToBusyServer = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (toobusy()) {
        throw new BaseError(
            HttpErrorMessage.SERVER_BUSY,
            HttpStatusCode.SERVER_BUSY
        );
    } else {
        next();
    }
};

export const handleContentSecurityPolicy = contentSecurityPolicy({
    useDefaults: true,
    directives: {
        defaultSrc: ["'self'", 'default.example'],
        scriptSrc: ["'self'", 'js.example.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    },
    reportOnly: false,
});

export const handleCors = () => {
    if (__DEV__) {
        return cors();
    } else {
        return cors({ origin: env.CLIENT_URL });
    }
};



export const handleNotFound = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    throw new BaseError(HttpErrorMessage.NOT_FOUND, HttpStatusCode.NOT_FOUND);
};
