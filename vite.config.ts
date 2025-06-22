import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    include: [
      "date-fns",
      "date-fns/format",
      "date-fns/addDays",
      "date-fns/locale",
      "react-day-picker",
    ],
    force: true,
  },
  plugins: [react(), tempo()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "date-fns": path.resolve(__dirname, "node_modules/date-fns"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
  // Add build configuration for better debugging
  build: {
    sourcemap: process.env.NODE_ENV === "development",
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress certain warnings but log others
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
});
