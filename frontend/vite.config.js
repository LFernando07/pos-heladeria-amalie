import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-images",
      closeBundle() {
        const srcDir = "images";
        const destDir = "dist/images";
        try {
          mkdirSync(destDir, { recursive: true });
          const copyRecursive = (src, dest) => {
            const entries = readdirSync(src);
            entries.forEach((entry) => {
              const srcPath = join(src, entry);
              const destPath = join(dest, entry);
              if (statSync(srcPath).isDirectory()) {
                mkdirSync(destPath, { recursive: true });
                copyRecursive(srcPath, destPath);
              } else {
                copyFileSync(srcPath, destPath);
              }
            });
          };
          copyRecursive(srcDir, destDir);
          console.log("✅ Imágenes copiadas a dist/");
        } catch (err) {
          console.error("❌ Error copiando imágenes:", err);
        }
      },
    },
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
  server: { port: 5173, strictPort: true, host: true },
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
