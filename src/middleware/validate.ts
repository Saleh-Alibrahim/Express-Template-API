import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { HttpStatusCode } from '../utils/http';

export const validateBody = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: error.errors[0].message,
                status: HttpStatusCode.BAD_REQUEST,
            });
        }
    };
};

export const validateParams = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: error.errors[0].message,
                status: HttpStatusCode.BAD_REQUEST,
            });
        }
    };
};

export const validateQuery = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: error.errors[0].message,
                status: HttpStatusCode.BAD_REQUEST,
            });
        }
    };
};

export const validateHeaders = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.headers);
            next();
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: error.errors[0].message,
                status: HttpStatusCode.BAD_REQUEST,
            });
        }
    };
};
