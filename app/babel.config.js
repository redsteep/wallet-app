process.env.TAMAGUI_TARGET ??= "native";

module.exports = function (api) {
  api.cache(true);

  const config = {
    presets: [
      [
        require.resolve("babel-preset-expo"),
        {
          native: {
            disableImportExportTransform: true,
          },
          web: {
            disableImportExportTransform: true,
          },
        },
      ],
    ],
    plugins: [
      [
        require.resolve("babel-plugin-transform-inline-environment-variables"),
        {
          include: ["TAMAGUI_TARGET"],
        },
      ],
      [
        require.resolve("@babel/plugin-transform-private-methods"),
        {
          loose: true,
        },
      ],
      [require.resolve("react-native-reanimated/plugin")],
    ],
  };

  if (process.env.TAMAGUI_TARGET === "native") {
    config.plugins.splice(config.plugins.length - 1, 0, [
      require.resolve("@tamagui/babel-plugin"),
      {
        components: ["tamagui"],
        config: "./tamagui.config.ts",
        disableExtraction: process.env.NODE_ENV === "development",
        logTimings: true,
      },
    ]);
  }
  return config;
};
