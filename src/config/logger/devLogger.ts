import { format, createLogger, transports } from 'winston';
const { combine, timestamp, printf, colorize, errors } = format;

function buildDevLogger() {
    const logFormat = printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    });
    return createLogger({
        level: 'debug',
        format: combine(
            colorize(),
            errors({ stack: true }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        ),
        transports: [new transports.Console()],
    });
}

export default buildDevLogger;
