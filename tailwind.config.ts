// export default {
//   theme: {
//     extend: {
//       colors: {
//         primary: "#FF5C8A",
//         secondary: "#FFF1F5",
//       },
//       borderRadius: {
//         xl: "16px",
//       },
//     },
//   },
// };

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4CAF50",     // xanh chính
        primaryDark: "#1B5E20", // xanh đậm
        primaryLight: "#E8F5E9",// nền nhẹ

        accent: "#FFB800",      // vàng sale
        accentSoft: "#FFF3CD",

        textDark: "#1F2937",
        textLight: "#6B7280",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};