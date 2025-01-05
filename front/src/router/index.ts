import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BoardView from '@/views/MyBoardsView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'cadastro',
      component: SignUpView,
    },
    {
      path: '/quadros',
      name: 'quadros',
      component: BoardView,
    },
  ],
})

export default router
