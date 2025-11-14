import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readFileSync, writeFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "fix-paths",
      closeBundle() {
        // Arreglar las rutas en index.html después del build
        const indexPath = "dist/index.html";
        try {
          let content = readFileSync(indexPath, "utf-8");
          // Reemplazar ./ por / en las rutas de assets
          content = content.replace(/\.\/assets\//g, "assets/");
          content = content.replace(
            /href="\.\/logo_amelie\.png"/g,
            'href="logo_amelie.png"'
          );
          writeFileSync(indexPath, content);
          console.log("✅ Rutas corregidas en index.html");
        } catch (err) {
          console.error("❌ Error corrigiendo rutas:", err);
        }
      },
    },
  ],
  base: "./",
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // <- tu backend
        changeOrigin: true,
      },
      "/images": {
        target: "http://localhost:5000", // <- sirve las imágenes desde backend
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",

    // añadimos el chunk splitting -> Para evitar carga inicial y elimina la advertencia de “chunks larger than 500 KB”
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          pdf: ["jspdf", "jspdf-autotable"],
          excel: ["xlsx"],
          utils: ["axios"],
        },
      },
    },
  },
});
