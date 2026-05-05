import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      { find: /^#\/(.*)$/, replacement: path.resolve(__dirname, "lib/$1") },
      { find: /^#(.*)$/, replacement: path.resolve(__dirname, "lib/$1") },
    ],
  },
  test: {
    environment: "node",
    globals: true,
    hookTimeout: 20000,
    testTimeout: 20000,
  },
});
