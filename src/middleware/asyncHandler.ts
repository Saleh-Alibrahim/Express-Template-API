import { Request, Response, NextFunction } from 'express';
import { HttpErrorMessage, HttpStatusCode } from '../utils/http';
import { BaseError } from './errorHandler';

export const asyncController = (fn: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await fn.call(this, req, res, next);
        } catch (error) {
            if (error instanceof BaseError) return next(error);
            return next(
                new BaseError(
                    HttpErrorMessage.INTERNAL_SERVER,
                    HttpStatusCode.INTERNAL_SERVER
                )
            );
        }
    };
};


