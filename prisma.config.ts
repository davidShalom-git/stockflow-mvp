import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prefer the unpooled URL for migrations; DATABASE_URL remains the app runtime URL.
    url: process.env.DIRECT_URL ?? env("DATABASE_URL"),
  },
});
