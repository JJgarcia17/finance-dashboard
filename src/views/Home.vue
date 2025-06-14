<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <!-- Navigation -->
    <nav class="relative z-10 flex justify-between items-center p-6 lg:px-12">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" class="text-white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FinanceApp</span>
      </div>
      <div class="flex gap-4">
        <router-link to="/login" class="px-6 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
          Iniciar Sesión
        </router-link>
        <router-link to="/register" class="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all shadow-lg hover:shadow-xl">
          Registrarse
        </router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-20">
      <div class="text-center mb-16">
        <h1 class="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
          <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
            Controla tu Futuro
          </span>
          <br>
          <span class="text-gray-800">Financiero</span>
        </h1>
        <p class="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transforma la manera en que manejas tu dinero con nuestra plataforma intuitiva, 
          potente y diseñada para hacerte prosperar.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <router-link to="/register" 
            class="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
            <span>Comenzar Gratis</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" class="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </router-link>
          <button @click="scrollToFeatures" class="px-8 py-4 text-gray-700 hover:text-blue-600 font-semibold text-lg transition-colors flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" fill="currentColor"/>
            </svg>
            <span>Ver Demo</span>
          </button>
        </div>
      </div>

      <!-- Features Preview Cards -->
      <div class="grid md:grid-cols-3 gap-8 mb-20" ref="featuresRef">
        <div class="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
          <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" class="text-white">
              <path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Gestión Inteligente</h3>
          <p class="text-gray-600 leading-relaxed">
            Organiza tus ingresos y gastos con categorías personalizadas y seguimiento automático.
          </p>
        </div>

        <div class="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" class="text-white">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Análisis Avanzado</h3>
          <p class="text-gray-600 leading-relaxed">
            Visualiza tus patrones financieros con gráficos interactivos y reportes detallados.
          </p>
        </div>

        <div class="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
          <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" class="text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Presupuestos Inteligentes</h3>
          <p class="text-gray-600 leading-relaxed">
            Crea presupuestos adaptativos que te ayuden a alcanzar tus objetivos financieros.
          </p>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-white/50 shadow-xl">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Únete a miles de usuarios</h2>
          <p class="text-xl text-gray-600">que ya están transformando sus finanzas</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              10,000+
            </div>
            <p class="text-gray-600 font-medium">Usuarios Activos</p>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
              $50M+
            </div>
            <p class="text-gray-600 font-medium">Dinero Gestionado</p>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              99%
            </div>
            <p class="text-gray-600 font-medium">Satisfacción</p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center mt-20">
        <h2 class="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
          ¿Listo para tomar el control?
        </h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Comienza tu viaje hacia la libertad financiera hoy mismo. 
          Es gratis, es fácil y puede cambiar tu vida.
        </p>
        <router-link to="/register" 
          class="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
          <span>Empezar Ahora</span>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
        <p class="text-sm text-gray-500 mt-4">No requiere tarjeta de crédito • Configuración en 2 minutos</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 text-center py-8 text-gray-500">
      <p>&copy; 2025 FinanceApp. Diseñado para tu prosperidad.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const featuresRef = ref<HTMLElement>();

const scrollToFeatures = () => {
  featuresRef.value?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'center'
  });
};

// Animations on mount
onMounted(() => {
  // Add scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe feature cards
  const cards = document.querySelectorAll('[data-animate]');
  cards.forEach((card) => observer.observe(card));
});
</script>

<style scoped>
/* Gradients animados */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 4s ease infinite;
}

/* Efectos de entrada suaves */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% { 
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.3);
  }
}

/* Clases de animación */
.animate-in {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Efectos hover mejorados */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Responsive improvements */
@media (max-width: 768px) {
  .text-5xl {
    font-size: 2.5rem;
    line-height: 1.1;
  }
  
  .lg\:text-7xl {
    font-size: 3rem;
    line-height: 1.1;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .lg\:text-2xl {
    font-size: 1.25rem;
  }
}

/* Glass morphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Enhanced shadows */
.shadow-3xl {
  box-shadow: 
    0 35px 60px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Smooth transitions for all interactive elements */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:-translate-y-2:hover {
  transform: translateY(-0.5rem);
}

/* Loading states */
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

/* Focus states for accessibility */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #3b82f6;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}
</style>
