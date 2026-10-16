#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const target = (process.argv[2] || "sqlite").toLowerCase();
const validProviders = new Set(["sqlite", "postgresql"]);

if (!validProviders.has(target)) {
  console.error(`Usage: node scripts/switch-db-provider.mjs <sqlite|postgresql>`);
  process.exit(1);
}

const schemaPath = path.resolve(process.cwd(), "prisma/schema.prisma");
const postgresSchemaPath = path.resolve(process.cwd(), "prisma/schema.postgres.prisma");

const currentSchema = fs.readFileSync(schemaPath, "utf8");
const updatedSchema = currentSchema.replace(
  /datasource db \{\s*provider\s*=\s*"(sqlite|postgresql)"\s*\}/,
  `datasource db {\n  provider = "${target}"\n}`
);

fs.writeFileSync(schemaPath, updatedSchema, "utf8");

// Keep schema.postgres.prisma synced for production deployment reference
const pgSchema = currentSchema.replace(
  /datasource db \{\s*provider\s*=\s*"(sqlite|postgresql)"\s*\}/,
  `datasource db {\n  provider = "postgresql"\n}`
);
fs.writeFileSync(postgresSchemaPath, pgSchema, "utf8");

console.log(`Switched prisma/schema.prisma datasource provider to "${target}".`);
