import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import {useAuth} from "@/stores/auth.ts";
import BoardComponent from "@/components/BoardComponent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        auth: true,
      },
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: SignUpView,
    },
    {
      path: '/',
      redirect: { path: "/login" },
      name: '/',
      component: LoginView,
        children: [
            {
                path: "/login",
                name: "login",
                component: LoginView,
            },
        ],
    },
    {
      path: '/quadros',
      name: 'quadros',
      component: BoardComponent,
      meta: {
        auth: true,
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.meta?.auth) {
    const auth = useAuth();

    if (auth.token) {
      const authenticatedEmail: string = await auth.checkToken();
      if (authenticatedEmail) {
        next();
      } else {
        next({ name: 'login', query: { redirect: to.fullPath } });
      }
    } else {
      next({ name: 'login', query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});


export default router
