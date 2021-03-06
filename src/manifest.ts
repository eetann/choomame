import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Choomame (Alpha)",
  version: "1.0.1",
  permissions: ["unlimitedStorage", "storage"],
  background: { service_worker: "src/background/index.ts" },
  icons: {
    "16": "icons/icon-16x16.png",
    "32": "icons/icon-32x32.png",
    "48": "icons/icon-48x48.png",
    "128": "icons/icon-128x128.png",
  },
  options_page: "index.html",
  content_scripts: [
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.com/search*"],
    },
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.co.jp/search*"],
    },
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.co.th/search*"],
    },
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.es/search*"],
    },
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.fi/search*"],
    },
  ],
});
