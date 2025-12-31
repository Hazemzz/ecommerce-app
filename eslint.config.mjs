import nextPlugin from "eslint-plugin-next";
import globals from "globals";

export default [
    {
        ignores: ["node_modules", "dist", ".next", "coverage"]
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json"
            }
        },
        plugins: {
            next: nextPlugin
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            "react/jsx-key": "off"
        }
    }
];
