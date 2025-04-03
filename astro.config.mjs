// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
  i18n: {
    locales: ["es", "en", "ca"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
});