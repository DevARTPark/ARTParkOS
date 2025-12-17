import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: env("DATABASE_URL"),
        // @ts-expect-error - directUrl is supported in runtime but missing in types
        directUrl: env("DIRECT_URL"),
    },
    migrations: {
        path: "prisma/migrations",
    },
});