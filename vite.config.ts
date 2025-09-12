import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  const buildingIIFE = mode === "iife";

  if (buildingIIFE) {
    // IIFE (browser global) build
    return {
      plugins: [wasm()],
      build: {
        outDir: "dist/browser",
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, "src/browser.ts"),
          name: "SGP4",
          fileName: () => "sgp4.iife.js",
          formats: ["iife"],
        },
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) =>
              assetInfo.name === "sgp4_bg.wasm"
                ? "[name][extname]"
                : "assets/[name][extname]",
          },
        },
      },
    };
  }

  // Library (ESM + CJS) build
  return {
    plugins: [
      wasm(),
      // emit .d.ts into dist based on tsconfig
      dts({
        outDir: "dist",
        entryRoot: "src",
        include: ["src", "pkg/sgp4.d.ts", "pkg/sgp4_bg.wasm.d.ts"],
      }),
    ],
    build: {
      outDir: "dist",
      emptyOutDir: true,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        fileName: (format) => (format === "cjs" ? "index.cjs" : "index.js"),
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        // keep wasm-bindgen runtime unbundled so its URL logic stays intact
        external: ["../pkg/sgp4.js", "../pkg/sgp4_bg.wasm"],
        output: {
          exports: "named",
          preserveModules: false,
        },
      },
    },
  };
});
