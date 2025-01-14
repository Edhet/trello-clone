import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
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
import BoardComponent from './components/BoardComponent.vue'
import ListComponent from './components/ListComponent.vue'
import CollectionComponent from './components/CollectionComponent.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

const app = createApp(App)
const pinia = createPinia();

app.use(router)
app.use(pinia);
app.use(vuetify)

app.component('CardComponent', CardComponent)
app.component('BoardComponent', BoardComponent)
app.component('ListComponent', ListComponent)
app.component('CollectionComponent', CollectionComponent)

app.mount('#app')
