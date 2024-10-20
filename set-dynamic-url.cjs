const fs = require("node:fs");
const path = require("node:path");
const manifest = require("./dist/manifest.json");

const webAccessibleResources = manifest.web_accessible_resources;

const updatedWebAccessibleResources = webAccessibleResources.map((resource) => {
  if (resource.use_dynamic_url) {
    return {
      ...resource,
      use_dynamic_url: false,
    };
  }
  return resource;
});

manifest.web_accessible_resources = updatedWebAccessibleResources;

const json = JSON.stringify(manifest, null, 2);
fs.writeFileSync(path.resolve(__dirname, "./dist/manifest.json"), json, "utf8");
