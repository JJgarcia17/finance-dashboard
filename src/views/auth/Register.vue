<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary-light)]">
    <div class="bg-[var(--color-surface)] shadow-xl rounded-2xl p-6 w-full max-w-xs sm:max-w-sm border border-[var(--color-border)] animate-slide-up relative mt-10 mb-6">
      <div class="flex justify-center mb-4">
        <svg width="40" height="40" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-bounce-slow">
          <circle cx="28" cy="28" r="28" fill="var(--color-primary)" />
          <path d="M18 32L26 40L38 24" stroke="var(--color-accent)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="text-2xl font-extrabold mb-1 text-center text-[var(--color-primary)] tracking-tight">Crear cuenta</h2>
      <p class="text-[var(--color-muted)] mb-5 text-center text-sm">Regístrate para comenzar a gestionar tus finanzas</p>
      <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
        <div>
          <label for="name" class="block text-xs font-medium text-[var(--color-muted)] mb-1">Nombre</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Tu nombre"
            required
            autocomplete="name"
            class="px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] w-full text-sm transition"
          />
        </div>
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
        <div class="relative">
          <label for="password" class="block text-xs font-medium text-[var(--color-muted)] mb-1">Contraseña</label>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            required
            autocomplete="new-password"
            class="px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] w-full text-sm transition pr-10"
          />
          <button type="button" @click="showPassword = !showPassword" tabindex="-1" class="absolute right-2 top-1/2 -translate-y-1/2 translate-y-[2px] text-[var(--color-muted)] hover:text-[var(--color-primary)] focus:outline-none" aria-label="Mostrar/ocultar contraseña">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M3 3l18 18M10.7 10.7A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88M6.53 6.53C4.06 8.06 2 12 2 12s4 7 10 7c2.03 0 3.82-.38 5.29-1.03M17.47 17.47C19.94 15.94 22 12 22 12s-4-7-10-7c-1.13 0-2.21.13-3.22.36"/></svg>
          </button>
        </div>
        <div class="relative">
          <label for="confirm_password" class="block text-xs font-medium text-[var(--color-muted)] mb-1">Confirmar contraseña</label>
          <input
            id="confirm_password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="••••••••"
            required
            autocomplete="new-password"
            class="px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] w-full text-sm transition pr-10"
          />
          <button type="button" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1" class="absolute right-2 top-1/2 -translate-y-1/2 translate-y-[2px] text-[var(--color-muted)] hover:text-[var(--color-primary)] focus:outline-none" aria-label="Mostrar/ocultar confirmar contraseña">
            <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M3 3l18 18M10.7 10.7A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88M6.53 6.53C4.06 8.06 2 12 2 12s4 7 10 7c2.03 0 3.82-.38 5.29-1.03M17.47 17.47C19.94 15.94 22 12 22 12s-4-7-10-7c-1.13 0-2.21.13-3.22.36"/></svg>
          </button>
        </div>
        <button
          type="submit"
          class="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-bold text-base shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
          <span v-if="loading">Creando cuenta...</span>
          <span v-else>Crear cuenta</span>
        </button>
      </form>
      <div class="flex flex-col items-center mt-4">
        <span class="text-xs text-[var(--color-muted)]">¿Ya tienes cuenta?</span>
        <router-link to="/login" class="mt-1 text-[var(--color-primary)] font-semibold hover:underline transition text-sm">Iniciar sesión</router-link>
      </div>
      <p v-if="error" data-testid="register-error" class="text-[var(--color-danger)] text-xs mt-4 text-center animate-fade-in">{{ error }}</p>
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
import { register } from '../../services/auth/register';
import { useAuthStore } from '../../stores/auth/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const auth = useAuthStore();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

async function onSubmit() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    await register(name.value, email.value, password.value, confirmPassword.value);
    // Login automático tras registro
    const ok = await auth.loginUser(email.value, password.value);
    if (ok) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  } catch (e: any) {
    error.value = e?.message || 'Error al crear la cuenta';
  } finally {
    loading.value = false;
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
