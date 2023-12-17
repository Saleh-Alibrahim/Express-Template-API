import { PrismaClient } from '@prisma/client';
import { BaseError, errorFormatter } from '../middleware/errorHandler';
import { HttpErrorMessage, HttpStatusCode } from '../utils/http';
import { UpdateUserType } from '../types/userType';
const prisma = new PrismaClient({ errorFormat: 'minimal' });

export const retrieveUserListService = async () => {
    try {
        return await prisma.user.findMany();
    } catch (error) {
        errorFormatter(error);
    }
};

export const deactivateUserService = async (id: string) => {
    try {
        await prisma.user.update({
            data: {
                isActive: false,
            },
            where: {
                id,
            },
        });

        await prisma.session.updateMany({
            data: {
                isValid: false,
            },
            where: {
                userId: id,
            },
        });
    } catch (error) {
        errorFormatter(error);
    }
};

export const updateUserService =
    async ({ id, email, firstname, lastname }: UpdateUserType) => {
        try {
            return await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    email,
                    firstname,
                    lastname,
                },
            });
        }
        catch (error) {
            errorFormatter(error);
        }
    };

export const findUserByEmail = async (email: string) => {
    try {
        const user = prisma.user.findFirst({ where: { email: email } });
        if (!user) {
            throw new BaseError(
                HttpErrorMessage.INVALID_EMAIL,
                HttpStatusCode.BAD_REQUEST
            );
        }

        return user;
    } catch (error) {
        errorFormatter(error);
    }
};

export const findUserByIdService = async (id: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id,
                isActive: true,
                isVerified: true,
                session: {
                    isValid: true,
                },
            },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                role: true,
            },

        });
        if (!user) {
            throw new BaseError(
                HttpErrorMessage.INVALID_USER,
                HttpStatusCode.BAD_REQUEST
            );
        }

        return user;
    } catch (error) {
        errorFormatter(error);
    }
};
