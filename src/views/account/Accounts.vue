<template>
  <DashboardLayout>
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Cuentas</h1>
          <p class="text-gray-600">Gestiona tus cuentas bancarias y financieras</p>
        </div>
        <button 
          @click="showCreate = true" 
          class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 ease-in-out flex items-center gap-3 font-semibold hover:transform hover:scale-105" 
          data-testid="new-account-btn"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Nueva Cuenta
        </button>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label for="acc-type-filter" class="block text-sm font-semibold text-gray-700">Tipo de cuenta</label>
            <select 
              id="acc-type-filter" 
              v-model="filters.type" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option value="">Todos los tipos</option>
              <option v-for="type in accountTypes" :key="type" :value="type">
                {{ typeLabels[type] || type }}
              </option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="acc-status-filter" class="block text-sm font-semibold text-gray-700">Estado</label>
            <select 
              id="acc-status-filter" 
              v-model="filters.is_active" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option value="">Todos los estados</option>
              <option :value="true">✅ Activas</option>
              <option :value="false">❌ Inactivas</option>
            </select>
          </div>
        </div>
      </div>
      
      <div v-if="filterError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center animate-pulse">
        {{ filterError }}
      </div>      <!-- Accounts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="acc in accounts" 
          :key="acc.id" 
          :class="[
            'bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:transform hover:scale-105 group',
            acc.is_active ? '' : 'opacity-60 grayscale'
          ]"
        >
          <!-- Account Header -->
          <div class="flex items-center gap-4 mb-4">
            <div 
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg transition-transform duration-200 group-hover:scale-110" 
              :style="`background: linear-gradient(135deg, ${acc.color}, ${acc.color}dd)`"
            >
              <i :class="acc.icon"></i>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 text-lg mb-1">{{ acc.name }}</h3>
              <div class="flex items-center gap-2">
                <span 
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    getTypeColorClass(acc.type)
                  ]"
                >
                  <svg 
                    class="w-3 h-3 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      :d="getTypeIcon(acc.type)" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    />
                  </svg>
                  {{ typeLabels[acc.type] || acc.type }}
                </span>
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700"
                >
                  {{ acc.currency }}
                </span>
              </div>
            </div>
          </div>

          <!-- Account Balance -->
          <div class="space-y-3 mb-6">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
              <div class="text-sm text-gray-600 font-medium mb-1">Saldo actual</div>
              <div class="text-2xl font-bold text-gray-900">{{ acc.formatted_current_balance }}</div>
            </div>
            <div class="flex items-center gap-2">
              <span 
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold',
                  acc.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                ]"
              >
                <div 
                  :class="[
                    'w-2 h-2 rounded-full mr-2',
                    acc.is_active ? 'bg-green-500' : 'bg-gray-400'
                  ]"
                ></div>
                {{ acc.is_active ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            <button 
              @click="edit(acc)" 
              class="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-semibold"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Editar
            </button>
            
            <button 
              v-if="acc.deleted_at" 
              @click="restore(acc.id)" 
              class="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-semibold"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Restaurar
            </button>
            
            <button 
              v-else 
              @click="remove(acc.id)" 
              class="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-semibold"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Eliminar
            </button>
            
            <button 
              @click="toggleStatus(acc.id)" 
              class="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-semibold"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ acc.is_active ? 'Desactivar' : 'Activar' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="!accounts.length && !loading" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24">
            <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M22 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2M7 12h0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay cuentas</h3>
        <p class="text-gray-600 mb-6">Crea tu primera cuenta para empezar a gestionar tus finanzas</p>
        <button 
          @click="showCreate = true" 
          class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 ease-in-out font-semibold"
        >
          Crear primera cuenta
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex items-center gap-3 text-blue-600">
          <svg class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"/>
          </svg>
          <span class="text-lg font-semibold">Cargando cuentas...</span>
        </div>
      </div>      <!-- Modal crear/editar -->
      <div v-if="showCreate || editing" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-modal max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <button 
              @click="closeModal" 
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200" 
              aria-label="Cerrar modal"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            
            <div class="text-center mb-6">
              <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M22 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2M7 12h0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900 mb-1">
                {{ editing ? 'Editar Cuenta' : 'Nueva Cuenta' }}
              </h2>
              <p class="text-sm text-gray-600">
                {{ editing ? 'Actualiza la información' : 'Crea una nueva cuenta financiera' }}
              </p>
            </div>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Nombre y Tipo en la misma línea -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="acc-name" class="block text-sm font-semibold text-gray-700">Nombre</label>
                  <input 
                    id="acc-name" 
                    v-model="form.name" 
                    type="text" 
                    placeholder="Ej: Cuenta Corriente..." 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
                
                <div class="space-y-2">
                  <label for="acc-type" class="block text-sm font-semibold text-gray-700">Tipo</label>
                  <select 
                    id="acc-type" 
                    v-model="form.type" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                  >
                    <option value="">Selecciona tipo</option>
                    <option v-for="type in accountTypes" :key="type" :value="type">
                      {{ typeLabels[type] || type }}
                    </option>
                  </select>
                </div>
              </div>
              
              <!-- Color -->
              <div class="space-y-2">
                <label for="acc-color" class="block text-sm font-semibold text-gray-700">Color</label>
                <div class="flex items-center gap-3">
                  <input 
                    id="acc-color" 
                    v-model="form.color" 
                    type="color" 
                    required 
                    class="w-12 h-10 p-1 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    v-model="form.color" 
                    type="text" 
                    placeholder="#6366F1" 
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-sm"
                  />
                </div>
              </div>
              
              <!-- Icono -->
              <div class="space-y-2">
                <label for="acc-icon" class="block text-sm font-semibold text-gray-700">
                  Icono
                  <span class="ml-1 text-gray-400 cursor-help" title="Selecciona un icono representativo">
                    <svg class="inline w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </span>
                </label>
                <select 
                  id="acc-icon" 
                  v-model="form.icon" 
                  required 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                >
                  <option value="">Selecciona icono</option>
                  <option v-for="ico in iconOptions" :key="ico.value" :value="ico.value">
                    {{ ico.label }}
                  </option>
                </select>
              </div>
              
              <!-- Vista previa del icono -->
              <div v-if="form.icon" class="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-4">
                <div class="flex items-center gap-4">
                  <div 
                    class="w-12 h-12 rounded-lg flex items-center justify-center text-xl text-white shadow-sm" 
                    :style="`background: linear-gradient(135deg, ${form.color}, ${form.color}dd)`"
                  >
                    <i :class="form.icon"></i>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-700">Vista previa</p>
                    <p class="text-xs text-gray-500">{{ iconOptions.find(i => i.value === form.icon)?.label }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Moneda y Saldo inicial -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="acc-currency" class="block text-sm font-semibold text-gray-700">Moneda</label>
                  <select 
                    id="acc-currency" 
                    v-model="form.currency" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                  >
                    <option value="">Selecciona moneda</option>
                    <option v-for="cur in accountCurrencies" :key="cur.value" :value="cur.value">
                      {{ cur.label }}
                    </option>
                  </select>
                </div>
                
                <div class="space-y-2">
                  <label for="acc-initial-balance" class="block text-sm font-semibold text-gray-700">Saldo inicial</label>
                  <input 
                    id="acc-initial-balance" 
                    v-model="form.initial_balance" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="0.00" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
              </div>
              
              <!-- Estado activo -->
              <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mt-6">
                <input 
                  v-model="form.is_active" 
                  type="checkbox" 
                  id="acc-active"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="acc-active" class="flex-1 text-sm font-semibold text-gray-700">
                  Cuenta activa
                  <span class="block text-xs text-gray-500 font-normal mt-1">Disponible para transacciones</span>
                </label>
              </div>
              
              <!-- Botones de acción -->
              <div class="flex gap-3 pt-6">
                <button 
                  type="button"
                  @click="closeModal" 
                  class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  :disabled="submitting" 
                  class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"/>
                  </svg>
                  {{ editing ? 'Actualizar' : 'Crear' }}
                </button>
              </div>
              
              <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm animate-pulse mt-4" data-testid="form-error">
                {{ formError }}
              </div>
            </form>
          </div>        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :is-open="confirmationModal.isOpen.value"
      :type="confirmationModal.modalConfig.type"
      :title="confirmationModal.modalConfig.title"
      :message="confirmationModal.modalConfig.message"
      :confirm-text="confirmationModal.modalConfig.confirmText"
      :cancel-text="confirmationModal.modalConfig.cancelText"
      :item-name="confirmationModal.modalConfig.itemName"
      :item-description="confirmationModal.modalConfig.itemDescription"
      :item-color="confirmationModal.modalConfig.itemColor"
      :show-warning="confirmationModal.modalConfig.showWarning"
      :warning-message="confirmationModal.modalConfig.warningMessage"
      :loading="confirmationModal.loading.value"
      @confirm="confirmationModal.confirm"
      @cancel="confirmationModal.cancel"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch, computed } from 'vue';
import { useAccountsStore } from '../../stores/account/accounts';
import { useToast } from 'vue-toast-notification';
import { useConfirmationModal } from '../../composables/useConfirmationModal';
import { isValidIcon } from '../../utils/iconValidation';
import type { Account, AccountType, AccountFilters, AccountCurrency } from '../../types/account/account';

const DashboardLayout = defineAsyncComponent(() => import('../../components/DashboardLayout.vue'));
const ConfirmationModal = defineAsyncComponent(() => import('../../components/ConfirmationModal.vue'));

// Helper functions para los tipos de cuenta
const getTypeColorClass = (type: string): string => {
  const colorClasses: Record<string, string> = {
    bank: 'bg-blue-100 text-blue-800',
    credit_card: 'bg-purple-100 text-purple-800',
    cash: 'bg-green-100 text-green-800',
    savings: 'bg-indigo-100 text-indigo-800',
    investment: 'bg-orange-100 text-orange-800',
    loan: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800'
  };
  return colorClasses[type] || 'bg-gray-100 text-gray-800';
};

const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    bank: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
    credit_card: 'M2 10h20M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z',
    cash: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
    savings: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0l-2-7m-12 7l2-7',
    investment: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    loan: 'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2m4-2v6m0 0l3-3m-3 3L9 9',
    other: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  };
  return icons[type] || icons.other;
};

const store = useAccountsStore();
const accounts = computed(() => Array.isArray(store.accounts) ? store.accounts : []);
const loading = computed(() => store.loading);
const filters = reactive<AccountFilters>({...store.filters});

const accountTypes = [
  'bank', 'credit_card', 'cash', 'savings', 'investment', 'loan', 'other'
];
const typeLabels: Record<string, string> = {
  bank: 'Banco',
  credit_card: 'Tarjeta de crédito',
  cash: 'Efectivo',
  savings: 'Ahorro',
  investment: 'Inversión',
  loan: 'Préstamo',
  other: 'Otro',
};

const accountCurrencies = [
  { value: 'MXN', label: 'Peso mexicano (MXN)' },
  { value: 'USD', label: 'Dólar estadounidense (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'Libra esterlina (GBP)' },
  { value: 'CAD', label: 'Dólar canadiense (CAD)' },
];

// Solo watcher para tipo y estado
watch(
  () => [filters.type, filters.is_active],
  () => {
    store.fetchAll(cleanFilters(filters));
  }
);

const toast = useToast();
const confirmationModal = useConfirmationModal();

const showCreate = ref(false);
const editing = ref<Account | null>(null);
const form = reactive<{ name: string; type: AccountType | ''; color: string; icon: string; currency: AccountCurrency | ''; is_active: boolean; initial_balance: string }>(
  {
    name: '',
    type: '',
    color: '#6366F1',
    icon: '',
    currency: 'MXN',
    is_active: true,
    initial_balance: '0',
  }
);
const submitting = ref(false);

// Estado de error para el filtro y formulario
const filterError = ref<string | null>(null);
const formError = ref<string | null>(null);

const iconOptions = [
  { value: 'fas fa-university', label: 'Banco' },
  { value: 'fas fa-credit-card', label: 'Tarjeta' },
  { value: 'fas fa-wallet', label: 'Cartera' },
  { value: 'fas fa-money-bill-wave', label: 'Dinero' },
  { value: 'fas fa-piggy-bank', label: 'Ahorro' },
  { value: 'fas fa-chart-line', label: 'Inversión' },
  { value: 'fas fa-hand-holding-usd', label: 'Préstamo' },
  { value: 'fas fa-coins', label: 'Efectivo' },
  { value: 'fas fa-briefcase', label: 'Negocio' },
  { value: 'fas fa-building', label: 'Empresa' },
  { value: 'fas fa-gift', label: 'Regalo' },
  { value: 'fas fa-question', label: 'Otro' },
];

function edit(acc: Account) {
  editing.value = acc;
  Object.assign(form, {
    name: acc.name,
    type: acc.type,
    color: acc.color,
    icon: acc.icon,
    currency: acc.currency,
    is_active: acc.is_active,
    initial_balance: acc.initial_balance,
  });
  showCreate.value = false;
}

function closeModal() {
  showCreate.value = false;
  editing.value = null;
  Object.assign(form, { name: '', type: '', color: '#6366F1', icon: '', currency: 'MXN', is_active: true, initial_balance: '0' });
  submitting.value = false;
}

// Validación extra en el formulario
async function submitForm() {
  formError.value = null;
  // Validación de nombre
  if (!form.name || form.name.trim().length < 2) {
    formError.value = 'El nombre es obligatorio y debe tener al menos 2 caracteres.';
    toast.error(formError.value);
    return;
  }
  // Validación de tipo
  if (!form.type) {
    formError.value = 'Selecciona un tipo de cuenta';
    toast.error(formError.value);
    return;
  }
  // Validación de color
  if (!form.color || !/^#[0-9A-Fa-f]{6}$/.test(form.color)) {
    formError.value = 'Selecciona un color válido (#RRGGBB)';
    toast.error(formError.value);
    return;
  }
  // Validación de icono
  if (!form.icon || !isValidIcon(form.icon, iconOptions)) {
    formError.value = 'Selecciona un icono válido';
    toast.error(formError.value);
    return;
  }
  // Validación de moneda
  if (!form.currency || !accountCurrencies.some(c => c.value === form.currency)) {
    formError.value = 'Selecciona una moneda válida';
    toast.error(formError.value);
    return;
  }
  // Validación de saldo inicial
  const balance = parseFloat(form.initial_balance);
  if (isNaN(balance) || balance < -999999999.99 || balance > 999999999.99) {
    formError.value = 'El saldo inicial debe ser un número entre -999,999,999.99 y 999,999,999.99';
    toast.error(formError.value);
    return;
  }
  submitting.value = true;
  try {
    const payload = { ...form, type: form.type as AccountType, currency: form.currency as AccountCurrency };
    if (editing.value) {
      await store.update(editing.value.id, payload);
      toast.success('Cuenta actualizada');
    } else {
      await store.create(payload);
      toast.success('Cuenta creada');
    }
    closeModal();
    fetchAccounts();
  } catch (e: any) {
    toast.error(e?.message || 'Error al guardar');
  } finally {
    submitting.value = false;
  }
}

async function remove(id: number) {
  const account = accounts.value.find(acc => acc.id === id);
  if (!account) return;
  const confirmed = await confirmationModal.confirmDelete(
    account.name,
    `${typeLabels[account.type]} - ${account.currency}`,
    account.color || undefined
  );

  if (confirmed) {
    confirmationModal.setLoading(true);
    try {
      await store.remove(id);
      toast.success('Cuenta eliminada');
      fetchAccounts();
    } catch (e: any) {
      toast.error(e?.message || 'Error al eliminar');
    } finally {
      confirmationModal.setLoading(false);
    }
  }
}

async function restore(id: number) {
  const account = accounts.value.find(acc => acc.id === id);
  if (!account) return;
  const confirmed = await confirmationModal.confirmRestore(
    account.name,
    `${typeLabels[account.type]} - ${account.currency}`,
    account.color || undefined
  );

  if (confirmed) {
    confirmationModal.setLoading(true);
    try {
      await store.restore(id);
      toast.success('Cuenta restaurada');
      fetchAccounts();
    } catch (e: any) {
      toast.error(e?.message || 'Error al restaurar');
    } finally {
      confirmationModal.setLoading(false);
    }
  }
}

async function toggleStatus(id: number) {
  const account = accounts.value.find(acc => acc.id === id);
  if (!account) return;

  const confirmed = await confirmationModal.confirmStatusChange(
    account.name,
    account.is_active
  );

  if (confirmed) {
    confirmationModal.setLoading(true);
    try {
      await store.toggleStatus(id);
      toast.success('Estado actualizado');
      fetchAccounts();
    } catch (e: any) {
      toast.error(e?.message || 'Error al cambiar estado');
    } finally {
      confirmationModal.setLoading(false);
    }
  }
}

// Definir la función fetchAccounts antes de su uso
function fetchAccounts() {
  store.fetchAll(cleanFilters(filters));
}

// Inicial
fetchAccounts();

function cleanFilters(obj: typeof filters) {
  const out: Record<string, any> = {};
  if (obj.type) out.type = obj.type;
  if (typeof obj.is_active === 'boolean') out.is_active = obj.is_active;
  return out;
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dashboard-header p {
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

.animate-modal {
  animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes modalSlideIn {
  0% { 
    transform: scale(0.9) translateY(-20px); 
    opacity: 0; 
  }
  100% { 
    transform: scale(1) translateY(0); 
    opacity: 1; 
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
      align-items: stretch;
  }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dashboard-header p {
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

.animate-modal {
  animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes modalSlideIn {
  0% { 
    transform: scale(0.9) translateY(-20px); 
    opacity: 0; 
  }
  100% { 
    transform: scale(1) translateY(0); 
    opacity: 1; 
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>
