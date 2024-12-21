import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'

const messages = {
  en,
  zh,
  ja,
}

const i18n = createI18n({
  locale: 'zh',
  messages,
})

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.mount('#app')
