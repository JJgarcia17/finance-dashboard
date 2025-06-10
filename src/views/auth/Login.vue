<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary-light)]">
    <div class="bg-[var(--color-surface)] shadow-xl rounded-2xl p-6 w-full max-w-xs sm:max-w-sm border border-[var(--color-border)] animate-slide-up relative mt-10 mb-6">
      <div class="flex justify-center mb-4">
        <svg width="40" height="40" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-bounce-slow">
          <circle cx="28" cy="28" r="28" fill="var(--color-primary)" />
          <path d="M18 32L26 40L38 24" stroke="var(--color-accent)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="text-2xl font-extrabold mb-1 text-center text-[var(--color-primary)] tracking-tight">Bienvenido</h2>
      <p class="text-[var(--color-muted)] mb-5 text-center text-sm">Accede a tu panel financiero</p>
      <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
        <div>
          <label for="email" class="block text-xs font-medium text-[var(--color-muted)] mb-1">Correo electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="ejemplo@email.com"
            required
            autocomplete="username"
            class="px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] w-full text-sm transition"
          />
        </div>
        <div>
          <label for="password" class="block text-xs font-medium text-[var(--color-muted)] mb-1">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
            class="px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] w-full text-sm transition"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-bold text-base shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
      <div class="flex flex-col items-center mt-4">
        <span class="text-xs text-[var(--color-muted)]">¿No tienes cuenta?</span>
        <router-link to="/register" class="mt-1 text-[var(--color-primary)] font-semibold hover:underline transition text-sm">Crear cuenta</router-link>
      </div>
      <p v-if="error" data-testid="login-error" class="text-[var(--color-danger)] text-xs mt-4 text-center animate-fade-in">{{ error }}</p>
      <div class="absolute -top-5 -right-5 bg-[var(--color-accent)] rounded-full w-8 h-8 flex items-center justify-center shadow-md animate-pop">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path d="M12 2v20M2 12h20" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <footer class="mb-2 text-xs text-[var(--color-muted)] animate-fade-in delay-500">&copy; 2025 Finance Dashboard</footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const auth = useAuthStore();

async function onSubmit() {
  loading.value = true;
  error.value = '';
  const ok = await auth.loginUser(email.value, password.value);
  loading.value = false;
  if (ok) {
    router.push('/dashboard');
  } else {
    error.value = auth.error;
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slide-up {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes pop {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 1s ease;
}
.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(.4,2,.6,1) 0.1s both;
}
.animate-bounce-slow {
  animation: bounce-slow 2.5s infinite;
}
.animate-pop {
  animation: pop 0.7s cubic-bezier(.4,2,.6,1) 0.2s both;
}
</style>
