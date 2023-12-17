import jwt from 'jsonwebtoken';
import { BaseError } from '../middleware/errorHandler';
import { HttpErrorMessage, HttpStatusCode } from './http';

type singJWTType = (
    payload:
        | { session: string }
        | { userId: string; email: string; role: string },
    privateKey: string,
    options?: jwt.SignOptions
) => string;

const signJwt: singJWTType = (payload, privateKey, options) => {
    const signingKey = Buffer.from(privateKey, 'base64').toString('ascii');

    return jwt.sign(payload, signingKey, {
        ...(options && options),
        algorithm: 'RS256',
    });
};


const verifyJwt = (token: string, publicKey: string) => {
    const signinKey = Buffer.from(publicKey, 'base64').toString('ascii');

    try {
        const decoded = jwt.verify(token, signinKey) as jwt.JwtPayload;
        return decoded;
    } catch (error) {
        throw new BaseError(
            HttpErrorMessage.UN_AUTHORIZED,
            HttpStatusCode.UN_AUTHORIZED
        );
    }
};

export { signJwt, verifyJwt };
