/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}",],
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
        "inter-semibold": ["Inter SemiBold"],

        'default-bold': ['Karla Bold'],
        'default-bold-italic': ['Karla BoldItalic'],
        'default-extrabold': ['Karla ExtraBold'],
        'default-extrabold-italic': ['Karla ExtraBoldItalic'],
        'default-extralight': ['Karla ExtraLight'],
        'default-extralight-italic': ['Karla ExtraLightItalic'],
        'default-italic': ['Karla Italic'],
        'default-light': ['Karla Light'],
        'default-light-italic': ['Karla LightItalic'],
        'default-medium': ['Karla Medium'],
        'default-medium-italic': ['Karla MediumItalic'],
        'default-regular': ['Karla Regular'],
        'default-semibold': ['Karla SemiBold'],
        'default-semibold-italic': ['Karla SemiBoldItalic'],


      },
      fontSize: {
        "heading": "34px",
        "subheading": "24px",
        "item-heading": "17px",
        "item-caption": "13px",
        "tag": "10px ",
        "button": "10px",

        "display-large": "64px",
        "display-medium": "48px",
        "display-small": "40px",
        "headline-large": "32px",
        "headline-medium": "28px",
        "headline-small": "24px",
        "title-large": "22px",
        "title-medium": "16px",
        "title-small": "14px",
        "label-large": "16px",
        "label-medium": "14px",
        "label-small": "12px",
        "body-large": "16px",
        "body-medium": "14px",
        "body small": "12px"


      },
      lineHeight: {
        "display-large": "72px",
        "display-medium": "56px",
        "display-small": "48px",
        "headline-large": "40px",
        "headline-medium": "32px",
        "headline-small": "28px",
        "title-large": "28px",
        "title-medium": "24px",
        "title-small": "20px",
        "label-large": "24px",
        "label-medium": "20px",
        "label-small": "16px",
        "body-large": "24px",
        "body-medium": "20px",
        "body-small": "16px"

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
