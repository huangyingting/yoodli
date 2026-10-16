import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const isPostgres =
    process.env.DB_PROVIDER === "postgresql" ||
    databaseUrl.startsWith("postgres://") ||
    databaseUrl.startsWith("postgresql://");

  if (isPostgres) {
    const adapter = new PrismaPg({ connectionString: databaseUrl });
    return new PrismaClient({ adapter });
  }

  // Resolve SQLite file path for local development
  const rawFile = databaseUrl.replace(/^file:/, "");
  const resolvedPath = path.isAbsolute(rawFile)
    ? rawFile
    : path.resolve(/*turbopackIgnore: true*/ process.cwd(), rawFile);

  const adapter = new PrismaBetterSqlite3({
    url: `file:${resolvedPath}`,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
