/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "poppins-bold": ["Poppins Bold"],
        "poppins-light": ["Poppins Light"],
        "poppins-medium": ["Poppins Medium"],
        "poppins-regular": ["Poppins Regular"],
        "poppins-semibold": ["Poppins SemiBold"],
        "inter-bold": ["Inter Bold"],
        "inter-light": ["Inter Light"],
        "inter-medium": ["Inter Medium"],
        "inter-regular": ["Inter Regular"],
        "inter-semibold": ["Inter SemiBold"]

      },
      fontSize: {
        "heading": "34px",
        "subheading": "24px",
        "item-heading": "17px",
        "item-caption": "13px",
        "tag": "10px ",
        "button": "10px"

      },
      lineHeight: {
        "24": "24px"
      },

      colors: {
        dark: "#0A0F1B",
        pale: "#9FFFCB",
        buttongreen: "#25A18E",
        avatar: "#FFF3C7",
        darkblue: "#1D253A"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms")
  ]
};
