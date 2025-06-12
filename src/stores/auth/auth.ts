import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login, logout as apiLogout } from '../../services/auth/auth';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('auth_token') || '');
  const isAuthenticated = ref(!!token.value);
  const loading = ref(false);
  const error = ref('');

  function setUser(u: any) {
    user.value = u;
  }

  function setToken(t: string) {
    token.value = t;
    isAuthenticated.value = !!t;
    if (t) {
      localStorage.setItem('auth_token', t);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async function loginUser(email: string, password: string) {
    loading.value = true;
    error.value = '';
    const toast = useToast();
    try {
      const result = await login(email, password);
      const t = result.data?.token || result.token;
      const u = result.data?.user || result.user;
      setToken(t);
      setUser(u);
      toast.success('¡Bienvenido!');
      return true;
    } catch (e: any) {
      error.value = e?.message || 'Error de autenticación';
      setToken('');
      setUser(null);
      toast.error(error.value);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Limpieza de sesión y token, y limpieza de otros stores (placeholder)
  function logoutUser() {
    setToken('');
    setUser(null);
    apiLogout();
    delete axios.defaults.headers.common['Authorization'];
    // Limpieza de otros stores globales (cuentas, transacciones, presupuestos, etc.)
    // import { useAccountsStore } from './accounts';
    // useAccountsStore().$reset();
    // import { useTransactionsStore } from './transactions';
    // useTransactionsStore().$reset();
    // import { useBudgetsStore } from './budgets';
    // useBudgetsStore().$reset();
    const toast = useToast();
    toast.success('Sesión cerrada correctamente');
    // No redirigir aquí, dejar que el componente lo haga
  }

  // Cargar usuario si hay token (opcional, según API)
  function restoreSession() {
    const t = localStorage.getItem('auth_token');
    if (t) {
      setToken(t);
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      // Aquí podrías hacer una petición para obtener el usuario actual
    }
  }

  // Sincronización de logout entre pestañas
  window.addEventListener('storage', (event) => {
    if (event.key === 'auth_token' && !event.newValue) {
      setToken('');
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      // No navegamos ni mostramos toast aquí para evitar errores fuera de setup
      // El usuario activo recibirá feedback visual y redirección normalmente
    }
  });

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    loginUser,
    logoutUser,
    setUser,
    setToken,
    restoreSession,
  };
});
