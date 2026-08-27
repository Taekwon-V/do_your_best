import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Happy Hues Palette 17
        cream: {
          DEFAULT: "#fef6e4",
          subtle: "#fdf3dc",
        },
        navy: {
          DEFAULT: "#001858",
          muted: "#172c66",
          dark: "#000f38",
        },
        coral: {
          DEFAULT: "#f582ae",
          hover: "#e86e9c",
          light: "#fedfe9",
        },
        sky: {
          DEFAULT: "#8bd3dd",
          hover: "#7ac8d3",
          light: "#d5f1f5",
        },
        peach: {
          DEFAULT: "#f3d2c1",
          hover: "#ebd4b3",
          light: "#faf0ea",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 4px 14px 0 rgba(0, 24, 88, 0.06)",
        "card-hover": "0 8px 24px 0 rgba(0, 24, 88, 0.12)",
        retro: "3px 3px 0px 0px #001858",
        "retro-lg": "4px 4px 0px 0px #001858",
      },
    },
  },
  plugins: [],
};

export default config;
