<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Header simple -->
    <div class="p-4 border-b bg-gray-50">
      <h3 class="font-semibold">FinBot - Asistente Financiero</h3>
    </div>
    
    <!-- Área de mensajes -->
    <div class="flex-1 p-4 overflow-y-auto">
      <div class="text-center py-8">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-comments text-blue-600 text-xl"></i>
        </div>
        <h4 class="font-semibold text-gray-900 mb-2">¡Hola! Soy FinBot</h4>
        <p class="text-gray-600 mb-4">Pregúntame sobre tus finanzas</p>
      </div>
    </div>
    
    <!-- Input SIEMPRE visible -->
    <div class="p-4 border-t bg-gray-50">
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input
          v-model="message"
          type="text"
          placeholder="Escribe tu pregunta aquí..."
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');

const sendMessage = () => {
  console.log('Mensaje enviado:', message.value);
  alert('Mensaje: ' + message.value);
  message.value = '';
};
</script>
