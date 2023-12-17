import { BaseError, errorFormatter } from '../middleware/errorHandler';
import { prisma } from '../config/db/db';
import { HttpErrorMessage, HttpStatusCode } from '../utils/http';
import argon2 from 'argon2';
import { User } from '@prisma/client';
import { signJwt, verifyJwt } from '../utils/jwt';
import { env } from '../config/env/parseEnv';
import { findUserByIdService } from './user.service';
import { TokenPayloadType } from '../types/userType';

export const registerUserService =
    async ({ firstname, lastname, password, email }: User) => {
        const hashedPassword = await argon2.hash(password);

        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                password: hashedPassword,
                email,
            },
        });
        // TODO: send the verification email before going to prod
        // await sendVerificationEmail(user.email, user.id, verificationCode);
        return {
            userId: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        };
    };


export const getSessionService = async ({ userId }: { userId: string }) => {
    try {
        const session = await prisma.session.findFirst({
            where: {
                userId,
            },
        });

        if (!session) {
            return prisma.session.create({
                data: {
                    userId,
                },
            });
        } else {
            return session;
        }
    } catch (error) {
        errorFormatter(error);
    }
}

export const signRefreshTokenService = async ({ userId }: { userId: string }) => {
    const session = await getSessionService({ userId });

    if (!session) {
        throw new BaseError(
            HttpErrorMessage.INVALID_SESSION,
            HttpStatusCode.UN_AUTHORIZED
        );
    }

    const refreshToken = signJwt(
        { session: session.id },

        env.REFRESH_TOKEN_PRIVATE_KEY,
        {
            expiresIn: '1y',
        }
    );
    return refreshToken;
}

export const signAccessTokenService = (payload: TokenPayloadType) => {


    const accessToken = signJwt(payload, env.ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: env.NODE_ENV === 'development' ? '1y' : '15m',
    });

    return accessToken;
};

export const findSessionByIdService = async (id: string) => {
    try {
        const session = await prisma.session.findFirst({
            where: {
                id,
            },
        });

        if (!session || !session.isValid) {
            throw new BaseError(
                HttpErrorMessage.INVALID_REFRESH_TOKEN,
                HttpStatusCode.UN_AUTHORIZED
            );
        }

        return session;
    } catch (error) {
        errorFormatter(error);
    }
};

export const deleteSessionService = async (userId: string) => {
    try {
        return prisma.session.delete({
            where: {
                userId,
            },
        });
    } catch (error) {
        errorFormatter(error);
    }
};

export const findUserByEmailService = async (email: string) => {
    const user = prisma.user.findFirst({ where: { email: email } });
    if (!user) {
        throw new BaseError(
            HttpErrorMessage.INVALID_EMAIL,
            HttpStatusCode.BAD_REQUEST
        );
    }

    return user;
};

export const loginUserService =
    async (requestEmail: string, requestPassword: string) => {
        try {
            const user = await prisma.user.findFirst({
                where: { email: requestEmail },
            });

            if (!user) {
                throw new BaseError(
                    HttpErrorMessage.INVALID_CREDENTIALS,
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const isValid = await argon2.verify(user.password, requestPassword);

            if (!isValid) {
                throw new BaseError(
                    HttpErrorMessage.INVALID_CREDENTIALS,
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (!user.isActive) {
                throw new BaseError(
                    HttpErrorMessage.USER_NOT_ACTIVE,
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (!user.isVerified) {
                throw new BaseError(
                    HttpErrorMessage.USER_NOT_VERIFIED,
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const accessToken = signAccessTokenService({ userId: user.id, email: user.email, role: user.role });
            const refreshToken = await signRefreshTokenService({ userId: user.id });
            return { accessToken, refreshToken };
        } catch (error) {
            errorFormatter(error);
        }
    };

export const refreshAccessTokenService =
    async (refreshToken: string) => {
        try {
            const { session: sessionId } = await verifyJwt(
                refreshToken,
                env.REFRESH_TOKEN_PUBLIC_KEY
            );
            const session = await findSessionByIdService(sessionId);
            if (!session) {
                throw new BaseError(
                    HttpErrorMessage.INVALID_REFRESH_TOKEN,
                    HttpStatusCode.UN_AUTHORIZED
                );
            }
            const user = await findUserByIdService(session.userId);
            if (!user) {
                throw new BaseError(
                    HttpErrorMessage.INVALID_USER,
                    HttpStatusCode.UN_AUTHORIZED
                );
            }
            return signAccessTokenService({ userId: user.id, email: user.email, role: user.role });
        } catch (error) {
            errorFormatter(error);
        }
    };


export const checkVerificationCodeService = async (
    verificationCode: string,
    userId: string
) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user || !(user.verificationCode == verificationCode)) {
            throw new BaseError(HttpErrorMessage.VERIFICATION_CODE, HttpStatusCode.BAD_REQUEST);
        }
        const result = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isVerified: true,
            },
        });
        return result;
    } catch (error) {
        errorFormatter(error);
    }
};

