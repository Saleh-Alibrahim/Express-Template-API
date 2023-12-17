import { format, createLogger, transports } from 'winston';
const { combine, timestamp, json, errors } = format;

function buildProdLogger() {
    return createLogger({
        level: 'info',
        format: combine(
            errors({ stack: true }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            json()
        ),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: 'logs/error.log',
                level: 'error',
            }),
            new transports.File({ filename: 'logs/combined.log' }),
        ],
    });
}

export default buildProdLogger;
