import { Request, Response, NextFunction } from 'express';
import { HttpErrorMessage, HttpStatusCode } from '../utils/http';
import { Prisma } from '@prisma/client';
import { PrismaError } from 'prisma-error-enum';
import logger from '../config/logger';

export class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;

    constructor(message: string, httpCode: HttpStatusCode, isAjax = true) {
        super(message);
        this.name = 'BaseError';
        this.httpCode = httpCode;
        Error.captureStackTrace(this);
    }
}

export const errorFormatter = (error: any) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error);
    } else if (error instanceof BaseError) {
        throw new BaseError(error.message, error.httpCode);
    } else {
        throw new BaseError(error.message, HttpStatusCode.INTERNAL_SERVER);
    }

};

export const handleError = (
    error: BaseError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Handle 404
    if (error.httpCode === HttpStatusCode.NOT_FOUND) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
            status: HttpStatusCode.NOT_FOUND,
            message: HttpErrorMessage.NOT_FOUND,
        });
    }
    // Log to console for dev
    logger.error(error);
    const errorStatus = error.httpCode || HttpStatusCode.INTERNAL_SERVER;

    // Don't leak error details if it's a server error
    const errorMessage =
        errorStatus === HttpStatusCode.INTERNAL_SERVER
            ? HttpErrorMessage.INTERNAL_SERVER
            : error.message;

    // Send error message
    return res.status(errorStatus).json({
        status: errorStatus,
        message: errorMessage,
        success: false,
    });
};

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError) => {
    if (!error.meta) {
        throw new BaseError(
            error.stack || HttpErrorMessage.INTERNAL_SERVER,
            HttpStatusCode.INTERNAL_SERVER
        );
    }
    const fieldName = formatField(error.meta.target as string);
    switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
            throw new BaseError(
                `The ${fieldName} already exists. Please use a different value.`,
                HttpStatusCode.BAD_REQUEST
            );
        }
        case 'P2003':
            throw new BaseError(
                'Related record not found',
                HttpStatusCode.BAD_REQUEST
            );
        case 'P2010':
            throw new BaseError(
                'Invalid data format provided.',
                HttpStatusCode.BAD_REQUEST
            );
        case 'P2020': {
            throw new BaseError(
                `Invalid value provided for the ${fieldName}. Please provide a valid value.`,
                HttpStatusCode.BAD_REQUEST
            );
        }
        case 'P2023': {
            throw new BaseError(
                `The combination of ${fieldName} already exists. Please use a different combination.`,
                HttpStatusCode.BAD_REQUEST
            );
        }
        case 'P2025':
            throw new BaseError(
                'The record could not be deleted due to a reference in another table.',
                HttpStatusCode.BAD_REQUEST
            );
        default:
            throw new BaseError(
                error.stack || HttpErrorMessage.INTERNAL_SERVER,
                HttpStatusCode.INTERNAL_SERVER
            );
    }
};

const formatField = (field: string) => {
    switch (field) {
        case 'User_email_key':
            return 'email address';
    }
};
