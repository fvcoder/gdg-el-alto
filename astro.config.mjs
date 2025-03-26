// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon()],
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
