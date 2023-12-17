import { Request, Response, NextFunction } from 'express';

import { HttpErrorMessage, HttpStatusCode } from '../utils/http';
import { verifyJwt } from '../utils/jwt';
import { asyncController } from './asyncHandler';
import { BaseError } from './errorHandler';
import { env } from '../config/env/parseEnv';

type AuthOptions = 'TOKEN';
type AuthRoles = 'ADMIN' | 'USER' | 'MERCHANT';

const protectToken = async (req: Request) => {
    const authorization = req.headers.authorization;

    if (!(authorization && authorization.startsWith('Bearer'))) {
        return;
    }

    const accessToken = authorization.split(' ')[1];

    const user = verifyJwt(accessToken, env.ACCESS_TOKEN_PUBLIC_KEY);

    return user;
};

const protect = (...options: AuthOptions[]) => {
    return asyncController(
        async (req: Request, res: Response, next: NextFunction) => {
            let user;
            if (options.includes('TOKEN')) {
                user = await protectToken(req);
            }

            if (!user) {
                return next(
                    new BaseError(
                        HttpErrorMessage.UN_AUTHORIZED,
                        HttpStatusCode.UN_AUTHORIZED
                    )
                );
            }
            res.locals.user = user;
            next();
        }
    );
};

const authorize = (...roles: AuthRoles[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(res.locals.user.type)) {
            return next(
                new BaseError(
                    HttpErrorMessage.FORBIDDEN,
                    HttpStatusCode.FORBIDDEN
                )
            );
        }
        next();
    };
};

export { protect, authorize };
