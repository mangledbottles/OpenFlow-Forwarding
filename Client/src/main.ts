import { createApp } from 'vue'
import App from './App.vue'
// import Varlet from '@varlet/ui'
import naive from 'naive-ui'
// import '@varlet/ui/es/style.js'

createApp(App)
    .use(naive)
    .mount('#app')
