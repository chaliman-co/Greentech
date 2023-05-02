import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'

import '@/assets/main.css'
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import store from './store/store'
import router from './router/router'

const app = createApp(App)
app.use(PrimeVue)
app.use(store)
app.use(router)
app.component('Button', Button)

app.mount('#app')
