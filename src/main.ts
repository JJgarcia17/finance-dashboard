import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import { createPinia } from 'pinia';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuthStore } from './stores/auth/auth';

const app = createApp(App);
app.use(router);
const pinia = createPinia();
app.use(pinia);
app.use(ToastPlugin);

// Restaurar sesión si existe token
const authStore = useAuthStore();
// Llamar restoreSession de forma async sin bloquear el montaje
authStore.restoreSession().catch(console.error);

app.mount('#app');
