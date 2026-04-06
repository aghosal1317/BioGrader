// @ts-nocheck — Prisma 7 config types are still in early-access
import path from "node:path"
import { defineConfig } from "prisma/config"
import { config } from "dotenv"

// Load .env for Prisma CLI commands (Next.js reads .env.local separately)
config({ path: path.join(process.cwd(), ".env") })

const dbUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? ""

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg")
      const { Pool } = await import("pg")
      const pool = new Pool({ connectionString: dbUrl })
      return new PrismaPg(pool)
    },
  },
  datasource: {
    url: dbUrl,
  },
})
