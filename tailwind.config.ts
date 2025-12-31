import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#eef2ff",
                    100: "#e0e7ff",
                    200: "#c7d2fe",
                    300: "#a5b4fc",
                    400: "#818cf8",
                    500: "#6366f1",
                    600: "#4f46e5",
                    700: "#4338ca",
                    800: "#3730a3",
                    900: "#312e81"
                },
                accent: "#10b981",
                ink: "#0f172a"
            },
            fontFamily: {
                display: ["'DM Sans'", "system-ui", "sans-serif"],
                body: ["'Inter'", "system-ui", "sans-serif"]
            },
            boxShadow: {
                card: "0 10px 30px rgba(15,23,42,0.08)"
            }
        }
    },
    plugins: [require("@tailwindcss/forms")]
};

export default config;
