import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import 'animate.css'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')
