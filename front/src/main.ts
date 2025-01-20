import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Components
import CardComponent from './components/CardComponent.vue'
import MyBoardsComponent from './components/MyBoardsComponent.vue'
import ListComponent from './components/ListComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(vuetify)

app.component('CardComponent', CardComponent)
app.component('MyBoardsComponent', MyBoardsComponent)
app.component('ListComponent', ListComponent)
app.component('NavBarComponent', NavBarComponent)

app.mount('#app')
