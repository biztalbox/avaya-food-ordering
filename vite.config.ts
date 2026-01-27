import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env files for this mode
  const env = loadEnv(mode, process.cwd(), "VITE_");

  // Get base URL from environment variable, default to "/" if not set
  const baseUrl = env.VITE_BASE_URL || "/";
  // Ensure base URL ends with "/" for Vite
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  // Optional dev proxy target to avoid CORS (only used by Vite dev server)
  // Example: VITE_API_PROXY_TARGET=http://localhost
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "";

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: apiProxyTarget
        ? {
            "/online-order/api": {
              target: apiProxyTarget,
              changeOrigin: true,
              secure: false,
            },
            "/avaya/order/api": {
              target: apiProxyTarget,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
    },
  };
});
