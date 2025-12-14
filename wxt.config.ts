import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
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
