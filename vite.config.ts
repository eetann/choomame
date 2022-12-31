import manifest from "./src/manifest";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  test: {
    exclude: [
      '**/e2e/**',
      '**/playwright-report/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress}.config.*',
    ],
  }
});
