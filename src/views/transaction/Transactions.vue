<template>
  <DashboardLayout>
    <div class="max-w-5xl mx-auto py-8 px-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 class="text-2xl font-bold text-[var(--color-primary)]">Transacciones</h1>
        <button @click="showCreate = true" class="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded shadow transition flex items-center gap-2" data-testid="new-transaction-btn">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Nueva transacción
        </button>
      </div>
      <!-- Filtros -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 items-end bg-white/80 p-4 rounded-xl shadow border border-[var(--color-border)]">
        <div class="flex flex-col gap-1 min-w-0 md:col-span-1">
          <label for="trx-type-filter" class="text-xs font-semibold text-gray-600">Tipo</label>
          <select id="trx-type-filter" v-model="filters.type" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option :value="undefined">Todos</option>
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
            <option value="transfer">Transferencia</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 min-w-0 md:col-span-1">
          <label for="trx-account-filter" class="text-xs font-semibold text-gray-600">Cuenta</label>
          <select id="trx-account-filter" v-model="filters.account_id" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option :value="undefined">Todas</option>
            <option v-for="acc in accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 min-w-0 md:col-span-1">
          <label for="trx-category-filter" class="text-xs font-semibold text-gray-600">Categoría</label>
          <select id="trx-category-filter" v-model="filters.category_id" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option :value="undefined">Todas</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 min-w-0 md:col-span-2">
          <label for="trx-date-range" class="text-xs font-semibold text-gray-600">Rango de fechas</label>
          <div class="flex gap-2">
            <input id="trx-date-start" v-model="filters.min_date" type="date" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            <input id="trx-date-end" v-model="filters.max_date" type="date" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
        </div>
      </div>
      <div v-if="filterError" class="mb-4 text-center text-red-500 bg-red-50 border border-red-200 rounded p-2 animate-pulse">{{ filterError }}</div>
      <!-- Métricas: solo los tres cards requeridos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <MetricCard label="Transacciones totales" :value="stats?.total_transactions ?? '-'">
          <template #icon><i class="fas fa-list"></i></template>
        </MetricCard>
        <MetricCard label="Ingresos totales" :value="stats?.total_income !== undefined ? stats.total_income.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : '-'">
          <template #icon><i class="fas fa-arrow-down text-green-500"></i></template>
        </MetricCard>
        <MetricCard label="Gastos totales" :value="stats?.total_expenses !== undefined ? stats.total_expenses.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : '-'">
          <template #icon><i class="fas fa-arrow-up text-red-500"></i></template>
        </MetricCard>
      </div>
      <div v-if="statsError" class="mb-4 text-center text-red-500 bg-red-50 border border-red-200 rounded p-2 animate-pulse">{{ statsError }}</div>
      <!-- Tabla de transacciones con estilo premium -->
      <div class="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-white">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-500 uppercase text-xs tracking-wider">
              <th class="px-4 py-3 font-semibold text-left"> </th>
              <th class="px-4 py-3 font-semibold text-left">Fecha</th>
              <th class="px-4 py-3 font-semibold text-left">Cuenta</th>
              <th class="px-4 py-3 font-semibold text-left">Detalles</th>
              <th class="px-4 py-3 font-semibold text-left">ID</th>
              <th class="px-4 py-3 font-semibold text-left">Tipo</th>
              <th class="px-4 py-3 font-semibold text-right">Monto</th>
              <th class="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trx in transactions" :key="trx.id" class="border-b last:border-b-0 hover:bg-blue-50/40 transition group">
              <td class="px-4 py-3 align-middle">
                <span :class="[
                  'inline-flex items-center justify-center w-7 h-7 rounded-full shadow-sm border',
                  trx.type === 'income' ? 'bg-green-50 border-green-200 text-green-500' : trx.type === 'expense' ? 'bg-red-50 border-red-200 text-red-500' : 'bg-blue-50 border-blue-200 text-blue-500',
                  'group-hover:scale-110 transition-transform duration-200'
                ]">
                  <svg v-if="trx.type === 'income'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 19V5m0 0l-7 7m7-7l7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else-if="trx.type === 'expense'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14m0 0l7-7m-7 7l-7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8" stroke-linecap="round"/></svg>
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                <span>{{ trx.transaction_date }}</span>
                <span v-if="trx.created_at" class="block text-[10px] text-gray-400 font-mono">{{ trx.created_at.split(' ')[1] }}</span>
              </td>
              <td class="px-4 py-3">{{ trx.account?.name || '-' }}</td>
              <td class="px-4 py-3 text-gray-600">{{ trx.description || '-' }}</td>
              <td class="px-4 py-3 text-xs text-gray-400 font-mono" aria-label="ID de referencia">{{ trx.reference_number || '-' }}</td>
              <td class="px-4 py-3">
                <span :class=" [
                  'px-2 py-1 rounded text-xs font-semibold shadow-sm',
                  trx.type === 'income' ? 'bg-green-100 text-green-700' : trx.type === 'expense' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                ]">{{ typeLabels[trx.type] }}</span>
              </td>
              <td class="px-4 py-3 text-right font-bold">
                <span :class="trx.type === 'income' ? 'text-green-600' : trx.type === 'expense' ? 'text-red-600' : 'text-blue-600'">
                  {{ trx.type === 'expense' ? '-' : '+' }}{{ trx.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right flex gap-2 justify-end items-center">
                <button @click="edit(trx)" class="hover:bg-blue-50 p-1 rounded transition" title="Editar" aria-label="Editar transacción">
                  <i class="fas fa-pen text-blue-600 w-5 h-5"></i>
                </button>
                <button v-if="trx.can_delete" @click="remove(trx.id)" class="hover:bg-red-50 p-1 rounded transition" title="Eliminar" aria-label="Eliminar transacción">
                  <i class="fas fa-trash text-red-500 w-5 h-5"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!transactions.length && !loading">
              <td colspan="9" class="text-center py-8 text-gray-400">No hay transacciones</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Modal crear/editar -->
      <div v-if="showCreate || editing" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative animate-pop">
          <button @click="closeModal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none" aria-label="Cerrar modal">&times;</button>
          <h2 class="text-lg font-bold mb-6 text-[var(--color-primary)] text-center">{{ editing ? 'Editar' : 'Nueva' }} transacción</h2>
          <form @submit.prevent="submitForm" class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label for="trx-amount" class="text-xs font-semibold text-gray-600">Monto</label>
                <input id="trx-amount" v-model="form.amount" type="number" step="0.01" min="0.01" class="px-3 py-2 rounded border text-sm w-full min-w-0" required />
              </div>
              <div class="flex flex-col gap-1">
                <label for="trx-type" class="text-xs font-semibold text-gray-600">Tipo</label>
                <select id="trx-type" v-model="form.type" class="px-3 py-2 rounded border text-sm w-full min-w-0" required>
                  <option value="">Selecciona</option>
                  <option value="income">Ingreso</option>
                  <option value="expense">Gasto</option>
                  <option value="transfer">Transferencia</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label for="trx-account" class="text-xs font-semibold text-gray-600">Cuenta</label>
                <select id="trx-account" v-model="form.account_id" class="px-3 py-2 rounded border text-sm w-full min-w-0" required>
                  <option value="">Selecciona</option>
                  <option v-for="acc in accounts" :key="acc.id" :value="String(acc.id)">{{ acc.name }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label for="trx-category" class="text-xs font-semibold text-gray-600">Categoría</label>
                <select id="trx-category" v-model="form.category_id" class="px-3 py-2 rounded border text-sm w-full min-w-0" required>
                  <option value="">Selecciona</option>
                  <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">{{ cat.name }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label for="trx-date" class="text-xs font-semibold text-gray-600">Fecha</label>
                <input id="trx-date" v-model="form.transaction_date" type="date" class="px-3 py-2 rounded border text-sm w-full min-w-0" required />
              </div>
              <div class="flex flex-col gap-1">
                <label for="trx-description" class="text-xs font-semibold text-gray-600">Descripción</label>
                <input id="trx-description" v-model="form.description" type="text" maxlength="255" class="px-3 py-2 rounded border text-sm w-full min-w-0" required />
              </div>
              <div class="flex flex-col gap-1 col-span-2">
                <label for="trx-reference" class="text-xs font-semibold text-gray-600">Referencia</label>
                <input id="trx-reference" v-model="form.reference_number" type="text" maxlength="100" class="px-3 py-2 rounded border text-sm w-full min-w-0" />
              </div>
              <div class="flex flex-col gap-1 col-span-2">
                <label for="trx-notes" class="text-xs font-semibold text-gray-600">Notas</label>
                <textarea id="trx-notes" v-model="form.notes" maxlength="1000" class="px-3 py-2 rounded border text-sm w-full min-w-0"></textarea>
              </div>
            </div>
            <button type="submit" :disabled="submitting" class="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded mt-2 flex items-center justify-center font-semibold transition disabled:opacity-60">
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
import { defineAsyncComponent } from 'vue';
const DashboardLayout = defineAsyncComponent(() => import('../../components/DashboardLayout.vue'));
const MetricCard = defineAsyncComponent(() => import('../../components/MetricCard.vue'));

import { ref, computed, onMounted, watch, reactive } from 'vue';
import { useTransactionsStore } from '../../stores/transaction/transactions';
import { useAccountsStore } from '../../stores/account/accounts';
import { useCategoriesStore } from '../../stores/category/categories';
import { useToast } from 'vue-toast-notification';
import type { Transaction, TransactionType, TransactionFilters } from '../../types/transaction/transaction';

const store = useTransactionsStore();
const accountsStore = useAccountsStore();
const categoriesStore = useCategoriesStore();
const transactions = computed(() => Array.isArray(store.transactions) ? store.transactions : []);
const accounts = computed(() => Array.isArray(accountsStore.accounts) ? accountsStore.accounts : []);
const categories = computed(() => Array.isArray(categoriesStore.categories) ? categoriesStore.categories : []);
const loading = computed(() => store.loading);
const stats = computed(() => store.stats || {
  total_transactions: 0,
  total_income: 0,
  total_expenses: 0,
  net_balance: 0,
  current_month_transactions: 0,
  current_month_income: 0,
  current_month_expenses: 0
});
// Filtros reactivos compatibles con los tipos
const filters = reactive<TransactionFilters>({
  type: undefined,
  account_id: undefined,
  category_id: undefined,
  min_date: undefined,
  max_date: undefined
});

const typeLabels: Record<string, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  transfer: 'Transferencia',
};

const toast = useToast();
const showCreate = ref(false);
const editing = ref<Transaction | null>(null);
const submitting = ref(false);
const filterError = ref<string | null>(null);
const formError = ref<string | null>(null);
const statsError = ref('');

const form = reactive({
  account_id: '',
  category_id: '',
  type: '',
  amount: '',
  description: '',
  transaction_date: '',
  reference_number: '',
  notes: '',
});

// Limpia los filtros antes de enviarlos a la API para evitar enviar undefined o vacíos
function cleanFilters(obj: typeof filters) {
  const out: Record<string, any> = {};
  if (obj.type) out.type = obj.type;
  if (obj.account_id !== undefined) out.account_id = obj.account_id;
  if (obj.category_id !== undefined) out.category_id = obj.category_id;
  if (obj.min_date) out.start_date = obj.min_date;
  if (obj.max_date) out.end_date = obj.max_date;
  return out;
}

function fetchAll() {
  store.fetchAll(cleanFilters(filters));
}

async function fetchStatsWithError() {
  try {
    await store.fetchStats();
    statsError.value = '';
  } catch (e: any) {
    statsError.value = e?.response?.data?.message || e?.message || 'Error al cargar métricas';
    toast.error(statsError.value);
  }
}

onMounted(() => {
  if (!accountsStore.accounts.length) {
    accountsStore.fetchAll();
  }
  if (!categoriesStore.categories.length) {
    categoriesStore.fetchAll();
  }
  fetchAll();
  if (!store.stats) {
    fetchStatsWithError();
  }
});

watch(
  () => [filters.type, filters.account_id, filters.category_id, filters.min_date, filters.max_date],
  () => {
    fetchAll();
  }
);

function edit(trx: Transaction) {
  // Always fetch the latest transaction from the backend to get full account/category info
  const ensureLoaded = async () => {
    if (!accounts.value.length) await accountsStore.fetchAll();
    if (!categories.value.length) await categoriesStore.fetchAll();
    // Fetch the full transaction (with account/category objects)
    const fullTrx = await store.fetchOne(trx.id);
    editing.value = fullTrx;
    Object.assign(form, {
      account_id: fullTrx.account?.id !== undefined && fullTrx.account?.id !== null ? String(fullTrx.account.id) : '',
      category_id: fullTrx.category?.id !== undefined && fullTrx.category?.id !== null ? String(fullTrx.category.id) : '',
      type: fullTrx.type,
      amount: fullTrx.amount,
      description: fullTrx.description,
      transaction_date: fullTrx.transaction_date,
      reference_number: fullTrx.reference_number || '',
      notes: fullTrx.notes || '',
    });
    showCreate.value = false;
  };
  ensureLoaded();
}

function closeModal() {
  showCreate.value = false;
  editing.value = null;
  Object.assign(form, {
    account_id: '',
    category_id: '',
    type: '',
    amount: '',
    description: '',
    transaction_date: '',
    reference_number: '',
    notes: '',
  });
  submitting.value = false;
  formError.value = null;
}

async function submitForm() {
  formError.value = null;
  // Validaciones principales
  if (!form.account_id) {
    formError.value = 'Selecciona una cuenta';
    toast.error(formError.value);
    return;
  }
  if (!form.category_id) {
    formError.value = 'Selecciona una categoría';
    toast.error(formError.value);
    return;
  }
  if (!form.type) {
    formError.value = 'Selecciona un tipo de transacción';
    toast.error(formError.value);
    return;
  }
  if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) < 0.01 || Number(form.amount) > 999999999.99) {
    formError.value = 'El monto debe ser un número mayor a 0 y menor a 1,000,000,000';
    toast.error(formError.value);
    return;
  }
  if (!form.description || form.description.length < 2) {
    formError.value = 'La descripción es obligatoria y debe tener al menos 2 caracteres.';
    toast.error(formError.value);
    return;
  }
  if (!form.transaction_date) {
    formError.value = 'Selecciona una fecha válida';
    toast.error(formError.value);
    return;
  }
  if (form.reference_number && form.reference_number.length > 100) {
    formError.value = 'La referencia no puede tener más de 100 caracteres';
    toast.error(formError.value);
    return;
  }
  if (form.notes && form.notes.length > 1000) {
    formError.value = 'Las notas no pueden tener más de 1000 caracteres';
    toast.error(formError.value);
    return;
  }
  submitting.value = true;
  try {
    const payload = {
      account_id: Number(form.account_id),
      category_id: Number(form.category_id),
      type: form.type as TransactionType,
      amount: Number(form.amount),
      description: form.description,
      transaction_date: form.transaction_date,
      reference_number: form.reference_number || undefined,
      notes: form.notes || undefined,
    };
    if (editing.value) {
      await store.update(editing.value.id, payload);
      toast.success('Transacción actualizada');
    } else {
      await store.create(payload);
      toast.success('Transacción creada');
    }
    closeModal();
    fetchAll();
  } catch (e: any) {
    formError.value = e?.response?.data?.message || e.message || 'Error al guardar';
    toast.error(formError.value || 'Error desconocido');
  } finally {
    submitting.value = false;
  }
}

async function remove(id: number) {
  try {
    await store.remove(id);
    toast.success('Transacción eliminada');
    fetchAll();
  } catch (e: any) {
    toast.error(e?.message || 'Error al eliminar');
  }
}
</script>
