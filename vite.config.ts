import { defineConfig } from "vite";
import yaml from "@rollup/plugin-yaml";
import build from "@hono/vite-build/cloudflare-workers";
import devServer from "@hono/vite-dev-server";

export default defineConfig({
  plugins: [
    yaml(),
    devServer({
      entry: "./src/index.ts",
    }),
    build({
      entry: "./src/index.ts",
    }),
  ],
});
