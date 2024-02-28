import { watchEffect } from "vue";
import { useOptionsStore } from "@/composables/options-store";

const { theme } = useOptionsStore();

watchEffect(() => {
    const themeVal = theme.value;
    const documentEl = document.documentElement;

    if (themeVal === "dark") {
        documentEl.dataset.theme = "dark";
    } else if (themeVal === "light") {
        documentEl.dataset.theme = "light";
    } else {
        delete documentEl.dataset.theme;
    }
});
