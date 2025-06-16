import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import zhs from "./locales/zhs.json";
import zht from "./locales/zht.json";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";

const messages = {
  en,
  zhs,
  zht,
  ja,
  ko,
};

const i18n = createI18n({
  locale: "zhs",
  messages,
});

const app = createApp(App);
app.use(createPinia());
app.use(i18n);
app.mount("#app");
