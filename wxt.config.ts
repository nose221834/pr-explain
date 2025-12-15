import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"), // or "./src" if using src directory
      },
    },
  }),
  manifest: {
    name: "WXT + React",
    description: "WXT + React",
    version: "1.0.0",
    author: {
      email: "test@test.com",
    },
    homepage_url: "https://wxt.dev",
  },
});
