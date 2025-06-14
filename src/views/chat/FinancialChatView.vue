<template>
  <DashboardLayout>
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Asistente Financiero</h1>
          <p class="text-gray-600">Obtén consejos personalizados y analiza tus finanzas con inteligencia artificial</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="font-medium">Bot en línea</span>
          </div>
        </div>
      </div>      <!-- Chat Container -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style="height: 70vh; min-height: 500px;">
        <FinancialChat />
      </div>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <!-- Qué puede hacer el bot -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" class="text-white">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Análisis Inteligente</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              Analiza tus patrones de gasto
            </li>
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              Identifica oportunidades de ahorro
            </li>
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              Evalúa el progreso de presupuestos
            </li>
          </ul>
        </div>

        <!-- Consejos personalizados -->
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" class="text-white">
                <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Consejos Personalizados</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              Recomendaciones basadas en tus datos
            </li>
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              Estrategias de inversión y ahorro
            </li>
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              Optimización de presupuestos
            </li>
          </ul>
        </div>

        <!-- Consultas rápidas -->
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" class="text-white">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Consultas Rápidas</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              Balance actual de cuentas
            </li>
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              Resumen de gastos mensuales
            </li>
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              Estado de presupuestos
            </li>
          </ul>
        </div>
      </div>

      <!-- Tips de uso -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" class="text-white">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-yellow-800 mb-2">Consejos para aprovechar al máximo el asistente:</h4>
            <ul class="space-y-1 text-sm text-yellow-700">
              <li>• Haz preguntas específicas como "¿Cuánto gasté en restaurantes este mes?"</li>
              <li>• Pide consejos sobre categorías específicas de gastos</li>
              <li>• Solicita análisis de tendencias en tus finanzas</li>
              <li>• Pregunta sobre el progreso de tus presupuestos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const DashboardLayout = defineAsyncComponent(() => import('../../components/DashboardLayout.vue'));
const FinancialChat = defineAsyncComponent(() => import('../../components/FinancialChat.vue'));
</script>

<style scoped>
.dashboard-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .dashboard-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
