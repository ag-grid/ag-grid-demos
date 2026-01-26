import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";

export default defineConfig({
  resolve: {
    mainFields: ["module"],
  },
  plugins: [angular()],
});
