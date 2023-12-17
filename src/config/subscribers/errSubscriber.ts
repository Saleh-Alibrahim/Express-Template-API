import toobusy from 'toobusy-js';
import logger from '../logger';

export const prepareErrorSubs = () => {
    process.on('uncaughtException', (error: Error) => {
        logger.error(error);
        toobusy.shutdown();
        process.exit(1);
    });
    process.on('unhandledRejection', (error: Error) => {
        logger.error(error);
        toobusy.shutdown();
        process.exit(1);
    });

    process.on('SIGINT', () => {
        toobusy.shutdown();
        process.exit(1);
    });
};
