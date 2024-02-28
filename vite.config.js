import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "path";

function generateManifest() {
    const manifest = readJsonFile("src/manifest.json");
    const pkg = readJsonFile("package.json");
    const final = {
        version: pkg.version,
        ...manifest,
    };
    if (process.env.NODE_ENV === "development") {
        final.version_name = "dev " + final.version;
    }
    return final;
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        webExtension({
            manifest: generateManifest,
            watchFilePaths: ["package.json", "manifest.json"],
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
