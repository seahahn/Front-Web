module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/**/*.{html}", "./node_modules/tw-elements/dist/js/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("tw-elements/dist/plugin")],
};
