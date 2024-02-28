import "@fontsource/lato";
import "@/styles/styles.scss";

import { createApp } from "vue";
import { vAutofocus } from "@/directives/autofocus";
import MainApp from "@/pages/MainApp.vue";

const app = createApp(MainApp);
app.directive("autofocus", vAutofocus);
app.mount("body");
