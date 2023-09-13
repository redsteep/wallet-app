module.exports = function (api) {
  api.cache(true);

  return {
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
        require.resolve("@tamagui/babel-plugin"),
        {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
          disableExtraction: process.env.NODE_ENV === "development",
          logTimings: true,
        },
      ],
      [require.resolve("@babel/plugin-transform-private-methods"), { loose: true }],
      [require.resolve("react-native-reanimated/plugin")],
    ],
  };
};
