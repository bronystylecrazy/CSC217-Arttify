import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import prefresh from "@prefresh/vite";
import path from "path";
const mappedKeyValue = {};
import { dependencies } from "./package.json";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 3);

// eslint-disable-next-line require-jsdoc
function renderChunks(deps: Record<string, string>) {
  const chunks = {};
  Object.keys(deps).forEach((key) => {
    if (["react", "react-router-dom", "react-dom"].includes(key)) return;

    if (!mappedKeyValue[key]) {
      mappedKeyValue[key] = nanoid();
    }

    // chunks[key] = [mappedKeyValue[key]];

    chunks[mappedKeyValue[key]] = [key];
  });
  return chunks;
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [prefresh()],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: `import { h, Fragment } from 'preact'`,
  },
  root: "./",
  publicDir: "public",
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      {
        find: "react",
        replacement: "preact/compat",
      },
      {
        find: "react-dom",
        replacement: "preact/compat",
      },
      {
        find: "react/jsx-runtime",
        replacement: "preact/jsx-runtime",
      },
      {
        find: "react-dom/test-utils",
        replacement: "preact/test-utils",
      },
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-router-dom", "react-dom"],
          ...renderChunks(dependencies),
        },
      },
    },
  },
});