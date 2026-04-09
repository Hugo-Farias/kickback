import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/i18n/module"],
  runner: { disabled: true },
  vite: () => ({
    plugins: [tailwindcss(), preact()],
  }),
  manifest: {
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
    version: "0.0.1",
    permissions: ["storage"],
  },
});
