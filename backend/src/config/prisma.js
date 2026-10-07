import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// A single shared Prisma client instance. In dev with `node --watch`,
// re-importing this module on file changes could otherwise create a new
// client (and a new connection pool) on every reload — stash it on
// globalThis outside production to avoid exhausting connections.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.isProduction ? ["error", "warn"] : ["warn", "error"],
  });

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}
