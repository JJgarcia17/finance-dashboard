<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out">
      <!-- Logo/Brand Section -->
      <div class="px-6 py-6 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">FinanceApp</h1>
            <p class="text-sm text-gray-500 font-medium">Dashboard</p>
          </div>
        </div>
      </div>

      <!-- User Profile Section -->
      <div class="px-6 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-lg ring-4 ring-white">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-gray-900 truncate text-sm">{{ user?.name || 'Usuario' }}</div>
            <div class="text-xs text-gray-500 truncate">{{ user?.email || 'usuario@example.com' }}</div>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-4 py-6">
        <div class="space-y-1">
          <router-link 
            v-for="item in menu" 
            :key="item.to" 
            :to="item.to"            class="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 ease-in-out group relative hover:transform hover:translate-x-1"
            active-class="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-lg border-l-4 border-blue-500 active-nav-item"
          >
            <div class="flex items-center justify-center w-6 h-6 mr-3 text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
              <span v-html="item.icon" class="w-5 h-5"></span>
            </div>
            <span class="flex-1">{{ item.label }}</span>
            <div class="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-30 transition-opacity duration-200"></div>
          </router-link>
        </div>
      </nav>      <!-- Footer/Logout Section -->
      <div class="px-4 py-6 border-t border-gray-100">
        <button @click="logout" class="flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 ease-in-out group">
          <div class="flex items-center justify-center w-6 h-6 mr-3 text-gray-500 group-hover:text-red-600 transition-colors duration-200">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M16 17l5-5m0 0l-5-5m5 5H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="flex-1 text-left">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 ml-64 transition-all duration-300">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth/auth';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const user = computed(() => auth.user || { name: 'Usuario', email: '' });
const userInitials = computed(() => {
  if (!user.value.name) return '';
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase();
});

const menu = [
  { 
    label: 'Dashboard', 
    to: '/dashboard', 
    icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>' 
  },
  { 
    label: 'Categorías', 
    to: '/categories', 
    icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' 
  },
  { 
    label: 'Cuentas', 
    to: '/accounts', 
    icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M22 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2M7 12h0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' 
  },
  { 
    label: 'Transacciones', 
    to: '/transactions', 
    icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M7 17l5-5 5 5M7 7l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' 
  },
  { 
    label: 'Presupuestos', 
    to: '/budgets', 
    icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' 
  },
];

function logout() {
  auth.logoutUser();
  router.push('/login');
}
</script>

<style scoped>
/* Estado activo del menú */
.active-nav-item .w-2 {
  opacity: 1 !important;
  background-color: #3b82f6 !important;
}

.active-nav-item:hover {
  transform: none !important;
}

.active-nav-item .w-6 {
  color: #2563eb !important;
}

/* Responsive Design */
@media (max-width: 900px) {
  aside {
    width: 100vw;
    position: static;
    min-height: auto;
    box-shadow: none;
  }
  
  main {
    margin-left: 0;
    padding: 1rem;
  }
}

/* Mobile Menu Toggle */
@media (max-width: 768px) {
  aside {
    transform: translateX(-100%);
    position: fixed;
    z-index: 50;
  }
  
  aside.mobile-open {
    transform: translateX(0);
  }
  
  main {
    margin-left: 0;
  }
}

/* Scrollbar Styling for Navigation */
nav::-webkit-scrollbar {
  width: 0.25rem;
}

nav::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 0.25rem;
}

nav::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 0.25rem;
}

nav::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>
