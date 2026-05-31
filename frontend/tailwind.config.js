/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#3ecf8e",
          600: "#34b97a",
          700: "#fff",
        },
        secondary: {
          500: "#7c83ff",
          600: "#6366f1",
          700: "#4f46e5",
        },
        tertiary: {
          500: "#f59e0b",
        },
        neutral: {
          100: "#f3f4f6",
          300: "#d1d5db",
          500: "#6b7280",
          700: "#374151",
          800: "#1f2937",
          900: "#0f172a",
        },
      },
      borderRadius: {
        lg: "12px",
      },
    },
  },
  plugins: [],
};
