import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// In production, don't attach to global to prevent memory leaks
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
