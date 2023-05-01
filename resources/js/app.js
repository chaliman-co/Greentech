import './bootstrap';
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import store from './store/store'
import router from './router/router'
import '@/assets/main.css'
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)
app.use(PrimeVue)
app.use(store)
app.use(router)

app.mount('#app')