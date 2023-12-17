import { Request, Response } from 'express';
import { HttpStatusCode } from '../utils/http';
import { deleteSessionService, loginUserService, refreshAccessTokenService, registerUserService } from '../service/auth.service';
import { RefreshSchemaType, loginSchema, registerSchema } from '../zod/auth.schema';
import { TypedRequestBody } from 'zod-express-middleware';
import { User } from '@prisma/client';

export const registerHandler = async (
    req: TypedRequestBody<typeof registerSchema>,
    res: Response
) => {

    const body = req.body;

    const user = {
        ...body,
    } as User;

    await registerUserService(user);

    return res.status(HttpStatusCode.CREATED).json({
        message: 'User Registered !',
    });
};

export const loginHandler = async (
    req: TypedRequestBody<typeof loginSchema>,
    res: Response
) => {

    const data = await loginUserService(
        req.body.email, req.body.password
    );

    return res.status(HttpStatusCode.OK).json({
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
    });
};

export const logoutHandler = async (req: Request, res: Response) => {
    const user = res.locals.user;
    await deleteSessionService(user.userId);
    return res
        .status(HttpStatusCode.OK)
        .json({ message: 'User Logged out !' });
};

export const refreshAccessTokenHandler =
    async (req: Request, res: Response) => {
        const refreshToken = req.headers as RefreshSchemaType;
        const accessToken = await refreshAccessTokenService(refreshToken['headers.x-refresh']);
        return res.status(HttpStatusCode.OK).json({
            accessToken,
        });
    }
    ;

