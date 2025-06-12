<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary-light)] animate-fade-in">
    <!-- Header animado -->
    <header class="flex flex-col items-center mb-10 animate-slide-down">
      <div class="flex items-center gap-3">
        <svg width="48" height="48" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-bounce-slow">
          <circle cx="28" cy="28" r="28" fill="var(--color-primary)" />
          <path d="M18 32L26 40L38 24" stroke="var(--color-accent)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-2xl font-bold text-[var(--color-primary)] tracking-tight drop-shadow">Finance Dashboard</span>
      </div>
      <span class="mt-2 text-sm text-[var(--color-muted)] tracking-wide">Tu espacio para la abundancia financiera</span>
    </header>

    <!-- Card principal -->
    <div class="bg-[var(--color-surface)] shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-[var(--color-border)] relative animate-slide-up">
      <h1 class="text-4xl font-extrabold mb-3 text-[var(--color-primary)] text-center tracking-tight animate-fade-in delay-200">Bienvenido</h1>
      <p class="text-[var(--color-muted)] mb-8 text-center text-lg animate-fade-in delay-300">
        Organiza, visualiza y controla tus finanzas personales con elegancia y facilidad.
      </p>
      <button class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] animate-fade-in delay-400">
        Empezar ahora
      </button>
      <div class="absolute -top-6 -right-6 bg-[var(--color-accent)] rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-pop">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M12 2v20M2 12h20" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 text-xs text-[var(--color-muted)] animate-fade-in delay-500">&copy; 2025 Finance Dashboard</footer>
  </div>
</template>

<script setup lang="ts">
// Página Home aún más interactiva y elegante
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
@keyframes slide-down {
  from { transform: translateY(-40px); opacity: 0; }
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
.animate-slide-down {
  animation: slide-down 0.8s cubic-bezier(.4,2,.6,1) 0.1s both;
}
.animate-bounce-slow {
  animation: bounce-slow 2.5s infinite;
}
.animate-pop {
  animation: pop 0.7s cubic-bezier(.4,2,.6,1) 0.2s both;
}
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }
</style>
