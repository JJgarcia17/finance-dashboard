<template>
  <div class="welcome-banner flex items-center justify-between rounded-2xl p-4 mb-8 shadow-lg bg-gradient-to-br from-indigo-500/90 to-blue-400/80 relative overflow-hidden">
    <div>
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow">¡Bienvenido de nuevo, {{ userName }}!</h2>
      <p class="subtitle text-white/90 text-lg md:text-xl font-medium drop-shadow-sm">
        Gestiona tus finanzas de forma inteligente y visualiza tus métricas clave.
      </p>
    </div>
    <img src="/image/man-with-laptop.png" alt="Welcome" class="banner-img hidden md:block rounded-xl shadow-lg bg-white/20" />
    <div class="absolute right-0 bottom-0 w-40 h-40 bg-blue-300/30 rounded-full blur-2xl -z-10"></div>
    <div class="absolute left-0 top-0 w-32 h-32 bg-indigo-400/30 rounded-full blur-2xl -z-10"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const userName = computed(() => {
  const u = auth.user;
  if (u && typeof u === 'object' && u !== null && Object.prototype.hasOwnProperty.call(u, 'name')) {
    // @ts-ignore
    return u.name;
  }
  return 'Usuario';
});
</script>

<style scoped>
.subtitle {
  text-shadow: 0 1px 8px rgba(0,0,0,0.10);
}
.banner-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-left: 2.5rem;
}
@media (max-width: 700px) {
  .welcome-banner {
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem 1.2rem;
  }
  .banner-img {
    margin: 1.5rem 0 0 0;
    width: 70px;
    height: 70px;
  }
}
</style>
