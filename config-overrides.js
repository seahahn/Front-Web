const webpack = require("webpack");
module.exports = function override(config, env) {
  process.env.REACT_APP_STATUS === "development" && console.log("override");

  config.resolve.fallback = {
    fs: false,
    url: require.resolve("url"),
    // assert: require.resolve("assert-plus"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util"),
    tls: require.resolve("tls"),
    net: require.resolve("net"),
    zlib: require.resolve("browserify-zlib"),
    path: require.resolve("path-browserify"),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process",
      Buffer: ["buffer", "Buffer"],
    })
  );

  return config;
};
