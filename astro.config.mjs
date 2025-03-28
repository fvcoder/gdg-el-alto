// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

import react from "@astrojs/react";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon(), react()],
  redirects: {
    "/schedule": {
      status: 302,
      destination: "/about",
    },
    "/event": {
      status: 302,
      destination: "/about",
    },
  },
});