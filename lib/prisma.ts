import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';

const connectionString = process.env.DATABASE_URL!;

const prismaClientSingleton = () => {
    // Prisma 7 handles the pool internally when you pass the string to the adapter
    const adapter = new PrismaMssql(connectionString);
    return new PrismaClient({ adapter });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;