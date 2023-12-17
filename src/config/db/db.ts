import { PrismaClient } from '@prisma/client';
import logger from '../logger';

const prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'colorless',
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        logger.info('Database Connected !');
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
};

export { connectDB, prisma };
