import { createApp, watch } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import './assets/tailwind.css'

const app = createApp(App)
const pinia = createPinia();

watch(
  pinia.state,
  (state) => localStorage.setItem('options', JSON.stringify(state.options)),
  { deep: true },
);

app.use(pinia);
app.mount('#app');
