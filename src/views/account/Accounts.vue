<template>
  <DashboardLayout>
    <div class="max-w-5xl mx-auto py-8 px-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 class="text-2xl font-bold text-[var(--color-primary)]">Cuentas</h1>
        <button @click="showCreate = true" class="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded shadow transition flex items-center gap-2" data-testid="new-account-btn">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Nueva cuenta
        </button>
      </div>
      <!-- Filtros -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-8 items-end bg-white/80 p-4 rounded-xl shadow border border-[var(--color-border)]">
        <div class="flex flex-col gap-1 min-w-0">
          <label for="acc-type-filter" class="text-xs font-semibold text-gray-600">Tipo</label>
          <select id="acc-type-filter" v-model="filters.type" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option value="">Todos</option>
            <option v-for="type in accountTypes" :key="type" :value="type">{{ typeLabels[type] || type }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 min-w-0">
          <label for="acc-status-filter" class="text-xs font-semibold text-gray-600">Estado</label>
          <select id="acc-status-filter" v-model="filters.is_active" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option value="">Todos</option>
            <option :value="true">Activa</option>
            <option :value="false">Inactiva</option>
          </select>
        </div>
      </div>
      <div v-if="filterError" class="mb-4 text-center text-red-500 bg-red-50 border border-red-200 rounded p-2 animate-pulse">{{ filterError }}</div>
      <!-- Grid de cuentas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        <div v-for="acc in accounts" :key="acc.id" :class="['account-card', acc.is_active ? '' : 'account-card-inactive']">
          <div class="flex items-center gap-4 mb-3">
            <span class="icon-circle" :style="`background:${acc.color}`">
              <i :class="acc.icon"></i>
            </span>
            <div class="flex-1 min-w-0">
              <div class="font-bold text-[var(--color-primary)] text-lg truncate">{{ acc.name }}</div>
              <div class="text-xs mt-0.5 text-gray-500">{{ typeLabels[acc.type] || acc.type }}</div>
            </div>
            <span class="currency-badge" :style="`background:${acc.color};`">{{ acc.currency }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>Saldo:</span>
            <span class="font-semibold text-gray-700">{{ acc.formatted_current_balance }}</span>
            <span v-if="acc.is_active" class="status-badge status-badge-active">Activa</span>
            <span v-else class="status-badge status-badge-inactive">Inactiva</span>
          </div>
          <div class="flex gap-2 mt-auto justify-end action-btn-row">
            <button @click="edit(acc)" class="icon-btn edit" title="Editar">
              <i class="fas fa-pen"></i>
            </button>
            <button v-if="acc.deleted_at" @click="restore(acc.id)" class="icon-btn restore" title="Restaurar">
              <i class="fas fa-undo"></i>
            </button>
            <button v-else @click="remove(acc.id)" class="icon-btn delete" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
            <button @click="toggleStatus(acc.id)" class="icon-btn toggle" :title="acc.is_active ? 'Desactivar' : 'Activar'">
              <i :class="acc.is_active ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
            </button>
          </div>
        </div>
        <div v-if="!accounts.length && !loading" class="col-span-full text-center py-12 text-gray-400">No hay cuentas</div>
      </div>
      <div v-if="loading" class="py-8 text-center text-[var(--color-primary)] animate-pulse">Cargando...</div>
      <!-- Modal crear/editar -->
      <div v-if="showCreate || editing" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative animate-pop">
          <button @click="closeModal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none" aria-label="Cerrar modal">&times;</button>
          <h2 class="text-lg font-bold mb-6 text-[var(--color-primary)] text-center">{{ editing ? 'Editar' : 'Nueva' }} cuenta</h2>
          <form @submit.prevent="submitForm" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label for="acc-name" class="text-xs font-semibold text-gray-600">Nombre</label>
              <input id="acc-name" v-model="form.name" type="text" placeholder="Nombre" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="acc-type" class="text-xs font-semibold text-gray-600">Tipo</label>
              <select id="acc-type" v-model="form.type" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]">
                <option value="">Selecciona tipo</option>
                <option v-for="type in accountTypes" :key="type" :value="type">{{ typeLabels[type] || type }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label for="acc-color" class="text-xs font-semibold text-gray-600">Color</label>
              <input id="acc-color" v-model="form.color" type="color" required class="w-12 h-8 p-0 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="acc-icon" class="text-xs font-semibold text-gray-600">Icono
                <span class="ml-1 text-gray-400 cursor-help" title="Elige un icono representativo para la cuenta.">
                  <i class="fas fa-question-circle"></i>
                </span>
              </label>
              <select id="acc-icon" v-model="form.icon" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white">
                <option value="">Selecciona un icono</option>
                <option v-for="ico in iconOptions" :key="ico.value" :value="ico.value" :title="ico.label">
                  {{ ico.label }}
                </option>
              </select>
              <div v-if="form.icon" class="flex items-center gap-2 mt-2 p-2 rounded bg-gray-50 border border-gray-200">
                <span class="text-xs text-gray-500">Vista previa:</span>
                <span class="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[var(--color-primary-light)] bg-white text-xl" :style="`color:${form.color}`">
                  <i :class="form.icon"></i>
                </span>
                <span class="ml-1 text-xs text-gray-700">{{ iconOptions.find(i => i.value === form.icon)?.label }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label for="acc-currency" class="text-xs font-semibold text-gray-600">Moneda</label>
              <select id="acc-currency" v-model="form.currency" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white">
                <option value="">Selecciona moneda</option>
                <option v-for="cur in accountCurrencies" :key="cur.value" :value="cur.value">{{ cur.label }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label for="acc-initial-balance" class="text-xs font-semibold text-gray-600">Saldo inicial</label>
              <input id="acc-initial-balance" v-model="form.initial_balance" type="number" min="0" step="0.01" placeholder="0.00" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
            </div>
            <label class="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <input v-model="form.is_active" type="checkbox" class="accent-[var(--color-primary)]" /> Activa
            </label>
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
import DashboardLayout from '../../components/DashboardLayout.vue';
import { ref, reactive, watch, computed } from 'vue';
import { useAccountsStore } from '../../stores/account/accounts';
import { useToast } from 'vue-toast-notification';
import { isValidIcon } from '../../utils/iconValidation';
import type { Account, AccountType, AccountFilters, AccountCurrency } from '../../types/account/account';

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
  try {
    await store.remove(id);
    toast.success('Cuenta eliminada');
    fetchAccounts();
  } catch (e: any) {
    toast.error(e?.message || 'Error al eliminar');
  }
}
async function restore(id: number) {
  try {
    await store.restore(id);
    toast.success('Cuenta restaurada');
    fetchAccounts();
  } catch (e: any) {
    toast.error(e?.message || 'Error al restaurar');
  }
}
async function toggleStatus(id: number) {
  try {
    await store.toggleStatus(id);
    toast.success('Estado actualizado');
    fetchAccounts();
  } catch (e: any) {
    toast.error(e?.message || 'Error al cambiar estado');
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
.account-card {
  border-radius: 1.25rem;
  box-shadow: 0 4px 24px 0 rgba(99,102,241,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04);
  background: linear-gradient(135deg, #fff 70%, var(--color-primary-light) 100%);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1.5px solid var(--color-border);
  position: relative;
  min-height: 190px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.account-card:hover {
  box-shadow: 0 8px 32px 0 rgba(99,102,241,0.18), 0 3px 12px 0 rgba(0,0,0,0.07);
  transform: translateY(-2px) scale(1.025);
  z-index: 2;
}
.account-card-inactive {
  opacity: 0.6;
  filter: grayscale(0.7);
}
.icon-circle {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: 4px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.1rem;
  color: #fff;
  box-shadow: 0 2px 12px 0 rgba(99,102,241,0.13);
  transition: box-shadow 0.2s, transform 0.2s;
}
.account-card:hover .icon-circle {
  box-shadow: 0 4px 24px 0 rgba(99,102,241,0.22);
  transform: scale(1.08);
}
.currency-badge {
  margin-left: auto;
  padding: 0.25rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: bold;
  color: #fff;
  box-shadow: 0 1px 4px 0 rgba(99,102,241,0.13);
  border: 1.5px solid #fff;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  letter-spacing: 0.5px;
}
.status-badge {
  margin-left: 0.5rem;
  padding: 0.1rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.04);
  border: 1px solid #e5e7eb;
  display: inline-block;
}
.status-badge-active {
  background: #d1fae5;
  color: #059669;
  border-color: #bbf7d0;
}
.status-badge-inactive {
  background: #e5e7eb;
  color: #6b7280;
  border-color: #d1d5db;
}
.action-btn-row {
  margin-top: 0.5rem;
}
.icon-btn {
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: #f3f4f6;
  border: 1.5px solid transparent;
  font-size: 1.15rem;
  transition: background 0.15s, color 0.15s, border 0.15s, box-shadow 0.15s;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
  color: #6b7280;
  margin-left: 0.15rem;
  margin-right: 0.15rem;
  cursor: pointer;
}
.icon-btn.edit {
  color: #2563eb;
}
.icon-btn.edit:hover {
  background: #eff6ff;
  border-color: #93c5fd;
}
.icon-btn.restore {
  color: #059669;
}
.icon-btn.restore:hover {
  background: #ecfdf5;
  border-color: #6ee7b7;
}
.icon-btn.delete {
  color: #dc2626;
}
.icon-btn.delete:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}
.icon-btn.toggle {
  color: #a16207;
}
.icon-btn.toggle:hover {
  background: #fef9c3;
  border-color: #fde68a;
}
</style>
