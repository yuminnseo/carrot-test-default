/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "theme-lightscalegray-900": "var(--theme-lightscalegray-900)",
        "theme-lightsemanticdivider-3": "var(--theme-lightsemanticdivider-3)",
        "theme-lightsemanticpaper-default":
          "var(--theme-lightsemanticpaper-default)",
      },
      fontFamily: {
        "body-large": "var(--body-large-font-family)",
        "body-medium": "var(--body-medium-font-family)",
        "body-small": "var(--body-small-font-family)",
        "caption-medium": "var(--caption-medium-font-family)",
        "caption-small": "var(--caption-small-font-family)",
        "caption-xsmall": "var(--caption-xsmall-font-family)",
        headline: "var(--headline-font-family)",
        "label-large": "var(--label-large-font-family)",
        "label-medium": "var(--label-medium-font-family)",
        "label-small": "var(--label-small-font-family)",
        "platform-label5-regular": "var(--platform-label5-regular-font-family)",
        "title-large": "var(--title-large-font-family)",
        "title-medium": "var(--title-medium-font-family)",
        "title-small": "var(--title-small-font-family)",
        "title-xlarge": "var(--title-xlarge-font-family)",
        "title-xsmall": "var(--title-xsmall-font-family)",
        "title-xxlarge": "var(--title-xxlarge-font-family)",
      },
      boxShadow: {
        "shadow-100": "var(--shadow-100)",
        "shadow-200": "var(--shadow-200)",
      },
    },
  },
  plugins: [],
};
