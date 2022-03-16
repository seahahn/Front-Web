module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/tw-elements/dist/js/**/*.js"],
  theme: {
    extend: {},
    minWidth: {
      "1/2": "50%",
      "1/5": "20%",
      "1/10": "10%",
    },
    minHeight: {
      "1/5": "20%",
      "2/5": "40%",
      "3/5": "60%",
      "4/5": "80%",
    },
    maxHeight: {
      "1/5": "20%",
      "2/5": "40%",
      "3/5": "60%",
      "4/5": "80%",
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
};
