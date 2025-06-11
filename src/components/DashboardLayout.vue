<template>
  <div class="flex min-h-screen bg-white">
    <!-- Sidebar -->
    <aside class="w-64 bg-[var(--color-surface)] shadow-xl border-r border-[var(--color-border)] flex flex-col justify-between py-6 px-4 fixed inset-y-0 left-0 z-30 transition-transform">
      <!-- User Info -->
      <div>
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-2xl font-bold text-white">
            {{ userInitials }}
          </div>
          <div>
            <div class="font-semibold text-[var(--color-primary)]">{{ user?.name }}</div>
            <div class="text-xs text-[var(--color-muted)]">{{ user?.email }}</div>
          </div>
        </div>
        <nav class="flex flex-col gap-2">
          <router-link v-for="item in menu" :key="item.to" :to="item.to" class="flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-primary-light)]/10 transition font-medium" active-class="bg-[var(--color-primary-light)]/20 text-[var(--color-primary)]">
            <span v-if="item.icon" v-html="item.icon" class="w-5 h-5"></span>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </div>
      <button @click="logout" class="flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition font-medium mt-8">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M16 17l5-5m0 0l-5-5m5 5H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Cerrar sesión
      </button>
    </aside>
    <!-- Main content -->
    <main class="flex-1 ml-64 p-4 transition-all">
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
  { label: 'Dashboard', to: '/dashboard', icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" stroke="currentColor" stroke-width="2"/></svg>' },
  { label: 'Categorías', to: '/categories', icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
  { label: 'Cuentas', to: '/accounts', icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/></svg>' },
  // { label: 'Transacciones', to: '/transactions', icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 8v8m0 0l-3-3m3 3l3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg>' },
  // { label: 'Presupuestos', to: '/budgets', icon: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18" stroke="currentColor" stroke-width="2"/></svg>' },
];

function logout() {
  auth.logoutUser();
  router.push('/login');
}
</script>

<style scoped>
@media (max-width: 900px) {
  aside {
    width: 100vw;
    position: static;
    min-height: auto;
    border-radius: 0;
    box-shadow: none;
  }
  main {
    margin-left: 0;
    padding: 1.5rem;
  }
}
</style>
