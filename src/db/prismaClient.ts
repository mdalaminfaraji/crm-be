import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// In development, use the global variable. In production (Vercel),
// create a new instance each time to prevent connection issues
const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// In development, attach to global object to maintain connection between hot reloads
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export { prisma };
