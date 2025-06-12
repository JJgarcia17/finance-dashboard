<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
    <!-- Elementos decorativos de fondo -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-full opacity-10 animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[var(--color-accent)] to-yellow-300 rounded-full opacity-8 animate-float-reverse"></div>
      <div class="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-[var(--color-success)] to-green-400 rounded-full opacity-10 animate-pulse-slow"></div>
    </div>
      <div class="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 w-full max-w-sm border border-white/20 animate-slide-up relative z-10">
      <!-- Header con logo mejorado -->
      <div class="flex justify-center mb-4">
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-full blur-lg opacity-30 animate-pulse-slow"></div>
          <div class="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-full p-2 shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold mb-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent">¡Bienvenido!</h2>
        <p class="text-slate-600 text-xs font-medium">Accede a tu panel financiero</p>      </div>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-3">
          <div class="group">
            <label for="email" class="block text-xs font-semibold text-slate-700 mb-1">Correo electrónico</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-slate-400 group-focus-within:text-[var(--color-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="tu@email.com"
                required
                autocomplete="username"
                class="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all duration-200 backdrop-blur-sm text-sm"
              />
            </div>
          </div>
          
          <div class="group">
            <label for="password" class="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-slate-400 group-focus-within:text-[var(--color-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                autocomplete="current-password"
                class="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all duration-200 backdrop-blur-sm text-sm"
              />
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          class="w-full relative overflow-hidden py-2.5 px-4 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          :disabled="loading"
        >
          <div class="flex items-center justify-center gap-2">
            <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span v-if="loading">Iniciando...</span>
            <span v-else>Iniciar Sesión</span>
          </div>
          
          <!-- Efecto shimmer en hover -->
          <div class="absolute inset-0 -top-px -bottom-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
        </button>
      </form>      
      <div class="flex flex-col items-center mt-5 space-y-3">
        <div class="text-center">
          <span class="text-xs text-slate-500">¿No tienes cuenta?</span>
          <router-link to="/register" class="ml-1 text-[var(--color-primary)] font-semibold hover:text-[var(--color-primary-light)] transition-colors duration-200 text-xs hover:underline">
            Crear cuenta
          </router-link>
        </div>
        
        <p class="text-xs text-slate-400 text-center">
          🔒 Información segura y protegida
        </p>
      </div>
      
      <p v-if="error" data-testid="login-error" class="text-[var(--color-danger)] text-xs mt-4 p-2 bg-red-50 border border-red-200 rounded-lg text-center animate-fade-in">
        <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </p>
    </div>
    
    <footer class="mt-4 text-xs text-slate-400 animate-fade-in delay-500 text-center">
      <span>&copy; 2025 Finance Dashboard</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth/auth';

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
  from { 
    opacity: 0; 
    transform: translateY(10px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from { 
    transform: translateY(40px); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(5deg); 
  }
}

@keyframes float-reverse {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(20px) rotate(-5deg); 
  }
}

@keyframes pulse-slow {
  0%, 100% { 
    opacity: 0.8; 
    transform: scale(1);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.05);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-reverse {
  animation: float-reverse 8s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* Efectos adicionales para mejorar la experiencia */
.group:focus-within label {
  color: var(--color-primary);
}

input:focus {
  transform: translateY(-1px);
}

button:active {
  transform: scale(0.98);
}

/* Glassmorphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Animación del shimmer del botón */
button:hover .shimmer {
  animation: shimmer 0.8s ease-in-out;
}
</style>
