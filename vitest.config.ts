import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    passWithNoTests: true,
    alias: {
      "@": path.resolve(__dirname, "src"),
      "next/headers": path.resolve(__dirname, "src/__mocks__/next-headers.ts"),
      "next/navigation": path.resolve(
        __dirname,
        "src/__mocks__/next-navigation.ts"
      ),
    },
  },
});
