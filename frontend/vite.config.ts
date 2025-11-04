import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  cacheDir: "./.vite-cache",
  plugins: [
    react({
      tsDecorators: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  server: {
    host: "localhost",
    port: 5173,
  },
  optimizeDeps: {
    include: ["lucide-react", "clsx", "react", "react-dom"],
  },
}));
