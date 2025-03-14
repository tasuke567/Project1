import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // ตั้งค่าให้ build ไฟล์ไปที่โฟลเดอร์ dist
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./vitest.setup.js",
  },
});
