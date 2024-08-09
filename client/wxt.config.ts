import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: [
      "storage",
      "identity",
      "tabs",
      "identity.email",
      "https://www.linkedin.com/*",
    ],
  },
});
