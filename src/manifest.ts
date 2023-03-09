import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Choomame",
  description: "quick information at hand",
  version: "1.0.1",
  permissions: ["unlimitedStorage", "storage", "alarms"],
  background: { service_worker: "src/background/index.ts" },
  icons: {
    "16": "icons/icon-16x16.png",
    "32": "icons/icon-32x32.png",
    "48": "icons/icon-48x48.png",
    "128": "icons/icon-128x128.png",
  },
  options_page: "index.html",
  action: {
    default_popup: "popup.html",
  },
  commands: {
    _execute_action: {
      suggested_key: {
        default: "Ctrl+Q",
      },
    },
    openPopupForVivaldi: {
      suggested_key: {
        default: "Alt+Q",
      },
      description: "open tab instead of popup for Vivaldi",
      global: true,
    },
  },
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
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.co.in/search*"],
    },
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.com.ua/search*"],
    },
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.co.kr/search*"],
    },
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.com.mx/search*"],
    },
    {
      js: ["src/content/index.tsx"],
      matches: ["https://www.google.com.nr/search*"],
    },
  ],
});
