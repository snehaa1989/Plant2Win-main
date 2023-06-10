/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        whitesmoke: "#f1f1f1",
        darkgreen: {
          "100": "#186804",
          "200": "rgba(24, 104, 4, 0.5)",
        },
        midnightblue: "#1b1464",
        black: "#000",
        gray: "#061802",
        honeydew: "#c7ead1",
      },
      fontFamily: {
        inter: "Inter",
      },
      borderRadius: {
        "8xs": "5px",
        "3xs": "10px",
      },
    },
    fontSize: {
      smi: "13px",
      xl: "20px",
      sm: "14px",
      "3xl": "22px",
      mini: "15px",
      xs: "12px",
      lg: "18px",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
