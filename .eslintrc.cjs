module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        webextensions: true,
    },
    extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
    rules: {
        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "vue/multi-word-component-names": "warn",
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    },
};
