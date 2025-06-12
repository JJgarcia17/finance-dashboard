<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" @click="onCancel">
    <div 
      class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-modal"
      @click.stop
    >
      <!-- Icon and Title -->
      <div class="text-center mb-6">
        <div 
          class="mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-4"
          :class="iconClasses"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              :d="iconPath"
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">
          {{ title }}
        </h3>
        <p class="text-gray-600 text-sm">
          {{ message }}
        </p>
      </div>

      <!-- Item Details (optional) -->
      <div v-if="itemName" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <div 
            v-if="itemColor"
            class="w-4 h-4 rounded-full flex-shrink-0"
            :style="`background-color: ${itemColor}`"
          />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">{{ itemName }}</p>
            <p v-if="itemDescription" class="text-sm text-gray-500 truncate">{{ itemDescription }}</p>
          </div>
        </div>
      </div>

      <!-- Warning Message -->
      <div v-if="showWarning" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <div>
            <p class="text-sm font-medium text-red-800">¡Atención!</p>
            <p class="text-sm text-red-700">{{ warningMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button 
          @click="onCancel"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          :disabled="loading"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="onConfirm"
          :disabled="loading"
          class="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          :class="confirmButtonClasses"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ConfirmationModalProps {
  isOpen: boolean
  type?: 'danger' | 'warning' | 'info'
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  itemName?: string
  itemDescription?: string
  itemColor?: string
  showWarning?: boolean
  warningMessage?: string
  loading?: boolean
}

const props = withDefaults(defineProps<ConfirmationModalProps>(), {
  type: 'danger',
  title: 'Confirmar acción',
  message: '¿Estás seguro de que deseas continuar?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  showWarning: false,
  warningMessage: 'Esta acción no se puede deshacer.',
  loading: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const iconClasses = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-100 text-red-600'
    case 'warning':
      return 'bg-yellow-100 text-yellow-600'
    case 'info':
      return 'bg-blue-100 text-blue-600'
    default:
      return 'bg-red-100 text-red-600'
  }
})

const iconPath = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z'
    case 'info':
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    default:
      return 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
  }
})

const confirmButtonClasses = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white'
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700 text-white'
    case 'info':
      return 'bg-blue-600 hover:bg-blue-700 text-white'
    default:
      return 'bg-red-600 hover:bg-red-700 text-white'
  }
})

const onConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const onCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}
</script>

<style scoped>
.animate-modal {
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
