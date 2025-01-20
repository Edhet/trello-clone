import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import { useAuth } from '@/stores/auth.store.ts'
import NewBoardView from '@/views/NewBoardView.vue'
import BoardView from '@/views/BoardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/cadastro',
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        auth: true,
      },
    },
    {
      path: '/quadro/:id',
      name: 'board',
      component: BoardView,
      meta: {
        auth: true,
      },
      props: true,
    },
    {
      path: '/quadro/novo',
      name: 'new-board',
      component: NewBoardView,
      meta: {
        auth: true,
      },
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/home',
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta || !to.meta.auth) next()

  const auth = useAuth()
  if (auth.getToken() && await auth.checkToken()) {
    next()
  } else {
    next({ path: '/login' })
  }
})

export default router
