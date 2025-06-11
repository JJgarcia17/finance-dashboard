<template>
  <DashboardLayout>
    <div class="max-w-5xl mx-auto py-8 px-2">      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 class="text-2xl font-bold text-[var(--color-primary)]" data-testid="budgets-title">Presupuestos</h1>
        <button @click="showCreate = true" class="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded shadow transition flex items-center gap-2" data-testid="new-budget-btn">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Nuevo presupuesto
        </button>
      </div>

      <!-- Filtros -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-end bg-white/80 p-4 rounded-xl shadow border border-[var(--color-border)]">
        <div class="flex flex-col gap-1 min-w-0">
          <label for="budget-category-filter" class="text-xs font-semibold text-gray-600">Categoría</label>
          <select id="budget-category-filter" v-model="filters.category_id" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option :value="undefined">Todas</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
        
        <div class="flex flex-col gap-1 min-w-0">
          <label for="budget-period-filter" class="text-xs font-semibold text-gray-600">Período</label>
          <select id="budget-period-filter" v-model="filters.period" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option :value="undefined">Todos</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
            <option value="quarterly">Trimestral</option>
            <option value="yearly">Anual</option>
          </select>
        </div>

        <div class="flex flex-col gap-1 min-w-0">
          <label for="budget-status-filter" class="text-xs font-semibold text-gray-600">Estado</label>
          <select id="budget-status-filter" v-model="filters.is_active" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option :value="undefined">Todos</option>
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>

        <div class="flex flex-col gap-1 min-w-0">
          <label for="budget-date-range" class="text-xs font-semibold text-gray-600">Rango de fechas</label>
          <div class="flex gap-1">
            <input id="budget-date-start" v-model="filters.start_date" type="date" class="px-2 py-2 rounded border text-xs w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            <input id="budget-date-end" v-model="filters.end_date" type="date" class="px-2 py-2 rounded border text-xs w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total presupuestos" :value="budgets.length.toString()">
          <template #icon><i class="fas fa-wallet text-blue-500"></i></template>
        </MetricCard>
        <MetricCard label="Presupuestos activos" :value="activeBudgets.length.toString()">
          <template #icon><i class="fas fa-check-circle text-green-500"></i></template>
        </MetricCard>
        <MetricCard label="Monto total" :value="totalAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })">
          <template #icon><i class="fas fa-money-bill-wave text-emerald-500"></i></template>
        </MetricCard>
        <MetricCard label="Monto activo" :value="activeAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })">
          <template #icon><i class="fas fa-chart-line text-purple-500"></i></template>
        </MetricCard>
      </div>

      <div v-if="filterError" class="mb-4 text-center text-red-500 bg-red-50 border border-red-200 rounded p-2 animate-pulse">{{ filterError }}</div>      <!-- Grid de presupuestos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div v-for="budget in budgets" :key="budget.id" :class="['bg-white/90 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col min-h-[200px]', budget.is_active ? '' : 'opacity-60 bg-gray-50/90']" data-testid="budget-card">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm" :style="`background:${budget.category.color}`">
              <i class="fas fa-wallet"></i>
            </span>
            <div class="flex-1 min-w-0">
              <div class="font-bold text-[var(--color-primary)] text-lg truncate">{{ budget.name }}</div>
              <div class="text-xs mt-0.5 text-gray-500">{{ budget.category.name }}</div>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-semibold" :style="`background:${budget.category.color}15; color:${budget.category.color}`">
              {{ periodLabels[budget.period] }}
            </span>
          </div>
          
          <div class="mb-3">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-600">Monto:</span>
              <span class="font-semibold text-lg">{{ parseFloat(budget.amount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }}</span>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{{ budget.start_date }}</span>
              <span>→</span>
              <span>{{ budget.end_date }}</span>
            </div>
          </div>          <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span v-if="budget.is_active" class="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Activo</span>
            <span v-else class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactivo</span>
          </div>

          <div v-if="budget.description" class="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
            {{ budget.description }}
          </div>          <div class="flex gap-2 mt-auto pt-3 border-t border-gray-100 justify-end">
            <button @click="edit(budget)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors bg-blue-100 text-blue-600 hover:bg-blue-200" title="Editar" data-testid="edit-budget-btn">
              <i class="fas fa-pen"></i>
            </button>
            <button v-if="budget.deleted_at" @click="restore(budget.id)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors bg-green-100 text-green-600 hover:bg-green-200" title="Restaurar">
              <i class="fas fa-undo"></i>
            </button>
            <button v-else @click="remove(budget.id)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors bg-red-100 text-red-600 hover:bg-red-200" title="Eliminar" data-testid="delete-budget-btn">
              <i class="fas fa-trash"></i>
            </button>
            <button @click="toggleStatus(budget.id)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200" :title="budget.is_active ? 'Desactivar' : 'Activar'" data-testid="toggle-budget-btn">
              <i :class="budget.is_active ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
            </button>
          </div>
        </div>
        <div v-if="!budgets.length && !loading" class="col-span-full text-center py-12 text-gray-400">No hay presupuestos</div>
      </div>
      
      <div v-if="loading" class="py-8 text-center text-[var(--color-primary)] animate-pulse">Cargando...</div>      <!-- Modal crear/editar -->
      <div v-if="showCreate || editing" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" data-testid="budget-modal">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative animate-pop max-h-[90vh] overflow-y-auto">
          <button @click="closeModal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none" aria-label="Cerrar modal">&times;</button>
          <h2 class="text-lg font-bold mb-6 text-[var(--color-primary)] text-center" data-testid="modal-title">{{ editing ? 'Editar' : 'Nuevo' }} presupuesto</h2>
          
          <form @submit.prevent="submitForm" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label for="budget-name" class="text-xs font-semibold text-gray-600">Nombre</label>
              <input id="budget-name" v-model="form.name" type="text" placeholder="Nombre del presupuesto" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="budget-category" class="text-xs font-semibold text-gray-600">Categoría</label>
              <select id="budget-category" v-model="form.category_id" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]">
                <option value="">Selecciona categoría</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label for="budget-amount" class="text-xs font-semibold text-gray-600">Monto</label>
              <input id="budget-amount" v-model="form.amount" type="number" min="0.01" step="0.01" placeholder="0.00" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="budget-period" class="text-xs font-semibold text-gray-600">Período</label>
              <select id="budget-period" v-model="form.period" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]">
                <option value="">Selecciona período</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label for="budget-start-date" class="text-xs font-semibold text-gray-600">Fecha inicio</label>
                <input id="budget-start-date" v-model="form.start_date" type="date" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
              </div>
              
              <div class="flex flex-col gap-1">
                <label for="budget-end-date" class="text-xs font-semibold text-gray-600">Fecha fin</label>
                <input id="budget-end-date" v-model="form.end_date" type="date" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label for="budget-description" class="text-xs font-semibold text-gray-600">Descripción (opcional)</label>
              <textarea id="budget-description" v-model="form.description" rows="3" placeholder="Descripción del presupuesto..." class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] resize-none"></textarea>
            </div>

            <label class="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <input v-model="form.is_active" type="checkbox" class="accent-[var(--color-primary)]" /> Activo
            </label>            <button type="submit" :disabled="submitting" class="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded mt-2 flex items-center justify-center font-semibold transition disabled:opacity-60" data-testid="save-budget-btn">
              <span v-if="submitting" class="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ editing ? 'Actualizar' : 'Crear' }}
            </button>
            
            <div v-if="formError" class="mb-2 text-center text-red-500 bg-red-50 border border-red-200 rounded p-2 animate-pulse" data-testid="form-error">{{ formError }}</div>
          </form>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../../components/DashboardLayout.vue';
import MetricCard from '../../components/MetricCard.vue';
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useBudgetsStore } from '../../stores/budget/budgets';
import { useCategoriesStore } from '../../stores/category/categories';
import { useToast } from 'vue-toast-notification';
import type { Budget, BudgetPeriod, BudgetFilters } from '../../types/budget/budget';

const store = useBudgetsStore();
const categoriesStore = useCategoriesStore();
const toast = useToast();

// Data
const budgets = computed(() => Array.isArray(store.budgets) ? store.budgets : []);
const activeBudgets = computed(() => store.activeBudgets);
const totalAmount = computed(() => store.totalAmount);
const activeAmount = computed(() => store.activeAmount);
const loading = computed(() => store.loading);
const categories = computed(() => categoriesStore.categories);

const filters = reactive<BudgetFilters>({...store.filters});

const showCreate = ref(false);
const editing = ref<Budget | null>(null);
const form = reactive<{
  name: string;
  category_id: number | '';
  amount: string;
  period: BudgetPeriod | '';
  start_date: string;
  end_date: string;
  is_active: boolean;
  description: string;
}>({
  name: '',
  category_id: '',
  amount: '',
  period: '',
  start_date: '',
  end_date: '',
  is_active: true,
  description: '',
});

const submitting = ref(false);
const filterError = ref<string | null>(null);
const formError = ref<string | null>(null);

// Constants
const periodLabels: Record<BudgetPeriod, string> = {
  weekly: 'Semanal',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  yearly: 'Anual',
};

// Watch filters
watch(
  () => [filters.category_id, filters.period, filters.is_active, filters.start_date, filters.end_date],
  () => {
    store.fetchAll(cleanFilters(filters));
  }
);

// Methods
function edit(budget: Budget) {
  editing.value = budget;
  Object.assign(form, {
    name: budget.name,
    category_id: budget.category.id,
    amount: budget.amount,
    period: budget.period,
    start_date: budget.start_date,
    end_date: budget.end_date,
    is_active: budget.is_active,
    description: budget.description || '',
  });
  showCreate.value = false;
}

function closeModal() {
  showCreate.value = false;
  editing.value = null;
  Object.assign(form, {
    name: '',
    category_id: '',
    amount: '',
    period: '',
    start_date: '',
    end_date: '',
    is_active: true,
    description: '',
  });
  submitting.value = false;
  formError.value = null;
}

async function submitForm() {
  formError.value = null;
  
  // Validaciones
  if (!form.name || form.name.trim().length < 2) {
    formError.value = 'El nombre es obligatorio y debe tener al menos 2 caracteres.';
    toast.error(formError.value);
    return;
  }
  
  if (!form.category_id) {
    formError.value = 'Selecciona una categoría';
    toast.error(formError.value);
    return;
  }
  
  if (!form.amount || parseFloat(form.amount) <= 0) {
    formError.value = 'El monto debe ser mayor a 0';
    toast.error(formError.value);
    return;
  }
  
  if (!form.period) {
    formError.value = 'Selecciona un período';
    toast.error(formError.value);
    return;
  }
  
  if (!form.start_date || !form.end_date) {
    formError.value = 'Las fechas de inicio y fin son obligatorias';
    toast.error(formError.value);
    return;
  }
  
  if (new Date(form.end_date) <= new Date(form.start_date)) {
    formError.value = 'La fecha de fin debe ser posterior a la fecha de inicio';
    toast.error(formError.value);
    return;
  }

  submitting.value = true;
  
  try {
    const payload = {
      name: form.name,
      category_id: form.category_id as number,
      amount: form.amount,
      period: form.period as BudgetPeriod,
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.is_active,
      description: form.description || undefined,
    };

    if (editing.value) {
      await store.update(editing.value.id, payload);
      toast.success('Presupuesto actualizado');
    } else {
      await store.create(payload);
      toast.success('Presupuesto creado');
    }
    
    closeModal();
    fetchBudgets();
  } catch (e: any) {
    toast.error(e?.message || 'Error al guardar');
  } finally {
    submitting.value = false;
  }
}

async function remove(id: number) {
  try {
    await store.remove(id);
    toast.success('Presupuesto eliminado');
    fetchBudgets();
  } catch (e: any) {
    toast.error(e?.message || 'Error al eliminar');
  }
}

async function restore(id: number) {
  try {
    await store.restore(id);
    toast.success('Presupuesto restaurado');
    fetchBudgets();
  } catch (e: any) {
    toast.error(e?.message || 'Error al restaurar');
  }
}

async function toggleStatus(id: number) {
  try {
    await store.toggleStatus(id);
    toast.success('Estado actualizado');
    fetchBudgets();
  } catch (e: any) {
    toast.error(e?.message || 'Error al cambiar estado');
  }
}

function fetchBudgets() {
  store.fetchAll(cleanFilters(filters));
}

function cleanFilters(obj: typeof filters) {
  const out: Record<string, any> = {};
  if (obj.category_id) out.category_id = obj.category_id;
  if (obj.period) out.period = obj.period;
  if (typeof obj.is_active === 'boolean') out.is_active = obj.is_active;
  if (obj.start_date) out.start_date = obj.start_date;
  if (obj.end_date) out.end_date = obj.end_date;
  return out;
}

// Lifecycle
onMounted(async () => {
  // Load categories first if not loaded
  if (!categories.value.length) {
    await categoriesStore.fetchAll();
  }
  
  // Then load budgets
  fetchBudgets();
});
</script>

<style scoped>
.animate-pop {
  animation: pop 0.2s cubic-bezier(.4,2,.6,1) both;
}

@keyframes pop {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

:root {
  --color-primary: #6366F1;
  --color-primary-dark: #4F46E5;
  --color-primary-light: #A5B4FC;
  --color-border: #E5E7EB;
}
</style>
