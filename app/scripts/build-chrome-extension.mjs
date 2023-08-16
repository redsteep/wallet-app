#!/usr/bin/env zx

import packageInfo from "../package.json" assert { type: "json" };

const pwd = await $`pwd`;
const outputDir = typeof argv["output-dir"] === "string" ? argv["output-dir"] : "dist";

await $`npx cross-env TAMAGUI_TARGET=web NODE_ENV=production npx expo export --platform web --output-dir ${outputDir}`;

within(async () => {
  cd("dist");

  const extensionManifestJson = JSON.stringify({
    name: packageInfo.name,
    description: packageInfo.description,
    version: "1.0",
    manifest_version: 3,
    action: {
      default_popup: "index.html",
      default_title: "Open Wallet",
    },
    icons: {
      16: "/assets/icon.png",
      48: "/assets/icon.png",
      128: "/assets/icon.png",
    },
    permissions: ["storage"],
  });

  await $`touch manifest.json && echo ${extensionManifestJson} > manifest.json`;
  await $`cp ${pwd}/assets/icon.png assets`;

  echo(
    [
      chalk.green.bold("An unpacked extension has been successfully built.\n"),
      "You can install it manually by following these steps:",
      `1. Navigate to ${chalk.bold(
        "chrome://extensions/"
      )} inside of your Chromium-based browser (Chrome, Edge)`,
      `2. Enable ${chalk.bold("Developer Mode")}`,
      `3. Press on ${chalk.bold("Load Unpacked")} button & select ${chalk.bold(
        outputDir
      )} folder inside of this project\n`,
      chalk.blue("Voila!"),
    ].join("\n")
  );
});
