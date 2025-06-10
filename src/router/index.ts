import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/auth/Login.vue';
import Register from '../views/auth/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Protección de rutas y persistencia de sesión
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  // Restaurar sesión si no está autenticado pero hay token
  if (!auth.isAuthenticated && localStorage.getItem('auth_token')) {
    auth.restoreSession();
  }
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  if (authRequired && !auth.isAuthenticated) {
    return next('/login');
  }
  next();
});

export default router;
