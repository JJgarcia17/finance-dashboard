<template>
  <div class="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">    <!-- Header del chat -->
    <div class="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <div class="flex items-center gap-2">
        <div class="avatar">
          <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <i class="fas fa-robot text-white text-xs"></i>
          </div>
        </div>
        <div>
          <h3 class="font-medium text-sm text-gray-900">FinBot</h3>
          <p class="text-xs text-gray-500">Tu asistente financiero</p>
        </div>
      </div>
        <!-- Botones de acción -->
      <div class="flex items-center gap-1">
        <button 
          @click="toggleSummary"
          class="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 text-xs"
          title="Ver resumen financiero"
        >
          <i class="fas fa-chart-line"></i>
        </button>
        <button 
          @click="clearChat"
          class="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-red-50 text-xs"
          title="Limpiar conversación"
          :disabled="!chatStore.hasMessages"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>    <!-- Resumen financiero (expandible) -->
    <div v-if="showSummary && chatStore.summary" class="px-2">
      <div class="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-1 mb-1">
            <i class="fas fa-info-circle text-blue-600 text-xs"></i>
            <span class="font-medium text-xs text-blue-900">Resumen Financiero</span>
          </div>
          <button 
            @click="showSummary = false"
            class="text-blue-600 hover:text-blue-800 text-xs"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="text-xs text-blue-800">{{ chatStore.summary.summary }}</p>
        <p class="text-xs text-blue-600 mt-1">
          Actualizado: {{ formatTime(chatStore.summary.last_updated) }}
        </p>
      </div>
    </div>    <!-- Área de mensajes -->
    <div class="flex-1 overflow-y-auto p-2 space-y-2" ref="messagesContainer" style="min-height: 200px; scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc;">
      <!-- Mensaje de bienvenida -->
      <div v-if="!chatStore.hasMessages" class="text-center">
        <div class="text-center py-4">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-comments text-blue-600 text-sm"></i>
          </div>
          <h4 class="font-medium text-sm text-gray-900 mb-2">¡Hola! Soy FinBot</h4>
          <p class="text-xs text-gray-600 mb-2">Tu asistente financiero. Puedo ayudarte a:</p>
          <div class="grid grid-cols-2 gap-1 text-xs text-left max-w-xs mx-auto">
            <div class="flex items-center gap-1">
              <i class="fas fa-chart-pie text-blue-600 text-xs"></i>
              <span>Analizar gastos</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="fas fa-piggy-bank text-green-600 text-xs"></i>
              <span>Revisar presupuestos</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="fas fa-lightbulb text-yellow-600 text-xs"></i>
              <span>Consejos de ahorro</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="fas fa-calculator text-purple-600 text-xs"></i>
              <span>Planificar finanzas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensajes de la conversación -->
      <div 
        v-for="message in chatStore.messages" 
        :key="message.id"
        :class="[
          'flex',
          message.isUser ? 'justify-end' : 'justify-start'
        ]"
      >        <div :class="[
          'max-w-xs lg:max-w-sm',
          message.isUser ? 'ml-6' : 'mr-6'
        ]">
          <div :class="[
            'relative px-2 py-1 rounded text-xs',
            message.isUser 
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          ]">
            <p class="whitespace-pre-wrap">{{ message.content }}</p>
            <span class="block text-xs mt-1 opacity-70">{{ formatTime(message.timestamp) }}</span>
          </div>
          
          <!-- Sugerencias del bot -->
          <div v-if="!message.isUser && message.suggestions?.length" class="mt-1">
            <p class="text-xs text-gray-600 mb-1">Sugerencias:</p>
            <div class="space-y-1">
              <button 
                v-for="(suggestion, index) in message.suggestions" 
                :key="index"
                @click="sendSuggestion(suggestion)"
                class="block w-full text-left text-xs p-1 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
      </div>      <!-- Indicador de escritura -->
      <div v-if="chatStore.isTyping" class="flex justify-start">
        <div class="max-w-xs lg:max-w-sm mr-6">
          <div class="relative px-2 py-2 rounded bg-gray-100 text-gray-900 rounded-bl-sm">
            <div class="flex space-x-1">
              <span class="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></span>
              <span class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></span>
              <span class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s;"></span>
            </div>
          </div>
        </div>
      </div>
    </div>    <!-- Sugerencias rápidas -->
    <div v-if="chatStore.suggestions && !chatStore.hasMessages" class="p-2 border-t border-gray-200">
      <div class="mb-2">
        <h5 class="text-xs font-medium text-gray-700 mb-1">Prueba preguntando:</h5>
        <div class="grid grid-cols-1 gap-1">
          <button 
            v-for="suggestion in chatStore.suggestions.general.slice(0, 3)" 
            :key="suggestion"
            @click="sendSuggestion(suggestion)"
            class="text-left p-2 text-xs text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded border border-gray-200 hover:border-blue-300 transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>    <!-- Input de mensaje -->
    <div class="p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <form @submit.prevent="sendUserMessage" class="flex gap-1">
        <div class="flex-1 relative">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Escribe tu pregunta..."
            class="w-full px-2 py-2 pr-8 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            :disabled="chatStore.isLoading || chatStore.isTyping"
            maxlength="500"
          />
          <div class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {{ newMessage.length }}/500
          </div>
        </div>
        <button
          type="submit"
          :disabled="!canSendMessage"
          class="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <i v-if="chatStore.isLoading" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>    <!-- Error display -->
    <div v-if="chatStore.error" class="px-2 pb-1">
      <div class="bg-red-50 border border-red-200 rounded p-2 mt-1">
        <div class="flex items-center gap-1">
          <i class="fas fa-exclamation-triangle text-red-600 text-xs"></i>
          <span class="text-red-800 text-xs">{{ chatStore.error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useChatStore } from '../stores/chat/chat';

const chatStore = useChatStore();
const newMessage = ref('');
const showSummary = ref(false);
const messagesContainer = ref<HTMLElement>();

// Computed
const canSendMessage = computed(() => {
  return newMessage.value.trim().length > 0 && 
         !chatStore.isLoading && 
         !chatStore.isTyping &&
         newMessage.value.length <= 500;
});

// Methods
const sendUserMessage = async () => {
  if (!canSendMessage.value) return;
  
  const message = newMessage.value.trim();
  newMessage.value = '';
  
  await chatStore.sendMessage(message);
  scrollToBottom();
};

const sendSuggestion = async (suggestion: string) => {
  await chatStore.sendMessage(suggestion);
  scrollToBottom();
};

const clearChat = async () => {
  // Limpiar conversación sin confirmación por ahora
  await chatStore.clearMessages();
};

const toggleSummary = async () => {
  if (!chatStore.summary) {
    await chatStore.fetchSummary();
  }
  showSummary.value = !showSummary.value;
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Lifecycle
onMounted(async () => {
  await chatStore.fetchSuggestions();
  await chatStore.fetchStats();
});

// Watch for new messages to auto-scroll
watch(() => chatStore.messages.length, () => {
  scrollToBottom();
});
</script>

