<template>
  <component :is="DashboardLayout">
    <div class="max-w-5xl mx-auto py-8 px-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 class="text-2xl font-bold text-[var(--color-primary)]">Categorías</h1>
        <button @click="showCreate = true" class="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded shadow transition flex items-center gap-2" data-testid="new-category-btn">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Nueva categoría
        </button>
      </div>

      <!-- Filtros responsive y mejor distribuidos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 items-end bg-white/80 p-4 rounded-xl shadow border border-[var(--color-border)]">
        <div class="flex flex-col gap-1 min-w-0">
          <label for="cat-search" class="text-xs font-semibold text-gray-600">Buscar</label>
          <div class="relative">
            <input id="cat-search" v-model="filters.search" type="text" placeholder="Buscar..." class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] pr-8" />
            <span v-if="loading" class="absolute right-2 top-2.5 text-[var(--color-primary)] animate-spin">
              <i class="fas fa-spinner"></i>
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-1 min-w-0">
          <label for="cat-type-filter" class="text-xs font-semibold text-gray-600">Tipo</label>
          <select id="cat-type-filter" v-model="filters.type" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option value="">Todos</option>
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 min-w-0">
          <label for="cat-status-filter" class="text-xs font-semibold text-gray-600">Estado</label>
          <select id="cat-status-filter" v-model="filters.is_active" class="px-3 py-2 rounded border text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option value="">Todos</option>
            <option :value="true">Activa</option>
            <option :value="false">Inactiva</option>
          </select>
        </div>
      </div>
      <div v-if="filterError" class="mb-4 text-center text-red-500 bg-red-50 border border-red-200 rounded p-2 animate-pulse">{{ filterError }}</div>

      <!-- Grid de cards mejorado -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        <div v-for="cat in categories" :key="cat.id" :class="['rounded-2xl shadow-lg bg-white/95 p-6 flex flex-col gap-3 border border-[var(--color-border)] relative transition group hover:shadow-xl', cat.is_active ? '' : 'opacity-60 grayscale']">
          <div class="flex items-center gap-4 mb-2">
            <span class="w-10 h-10 rounded-full border-2 border-[var(--color-primary-light)] flex items-center justify-center text-2xl bg-white shadow-sm" :style="`background:${cat.color}`">
              <i :class="cat.icon"></i>
            </span>
            <div>
              <div class="font-bold text-[var(--color-primary)] text-lg">{{ cat.name }}</div>
              <div class="text-xs mt-0.5" :class="cat.type === 'income' ? 'text-green-600' : 'text-red-500'">
                <i :class="cat.type === 'income' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'" class="mr-1"></i>
                {{ cat.type === 'income' ? 'Ingreso' : 'Gasto' }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span class="w-4 h-4 rounded-full border flex-shrink-0" :style="`background:${cat.color}`"></span>
            <span>{{ cat.color }}</span>
            <span v-if="cat.is_active" class="ml-2 text-green-600 font-semibold">Activa</span>
            <span v-else class="ml-2 text-gray-400 font-semibold">Inactiva</span>
          </div>
          <div class="flex gap-2 mt-auto">
            <button @click="edit(cat)" class="text-blue-600 hover:underline text-xs font-semibold">Editar</button>
            <button v-if="cat.deleted_at" @click="restore(cat.id)" class="text-green-600 hover:underline text-xs font-semibold">Restaurar</button>
            <button v-else @click="remove(cat.id)" class="text-red-500 hover:underline text-xs font-semibold">Eliminar</button>
            <button @click="toggleStatus(cat.id)" class="text-gray-500 hover:underline text-xs font-semibold">
              {{ cat.is_active ? 'Desactivar' : 'Activar' }}
            </button>
          </div>
        </div>
        <div v-if="!categories.length && !loading" class="col-span-full text-center py-12 text-gray-400">No hay categorías</div>
      </div>
      <div v-if="loading" class="py-8 text-center text-[var(--color-primary)] animate-pulse">Cargando...</div>

      <!-- Modal crear/editar -->
      <div v-if="showCreate || editing" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative animate-pop">
          <button @click="closeModal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none" aria-label="Cerrar modal">&times;</button>
          <h2 class="text-lg font-bold mb-6 text-[var(--color-primary)] text-center">{{ editing ? 'Editar' : 'Nueva' }} categoría</h2>
          <form @submit.prevent="submitForm" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label for="cat-name" class="text-xs font-semibold text-gray-600">Nombre</label>
              <input id="cat-name" v-model="form.name" type="text" placeholder="Nombre" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="cat-type" class="text-xs font-semibold text-gray-600">Tipo</label>
              <select id="cat-type" v-model="form.type" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]">
                <option value="">Selecciona tipo</option>
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label for="cat-color" class="text-xs font-semibold text-gray-600">Color</label>
              <input id="cat-color" v-model="form.color" type="color" required class="w-12 h-8 p-0 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="cat-icon" class="text-xs font-semibold text-gray-600">Icono
                <span class="ml-1 text-gray-400 cursor-help" title="Elige un icono representativo para la categoría. Puedes ver el significado pasando el mouse sobre cada opción.">
                  <i class="fas fa-question-circle"></i>
                </span>
              </label>
              <select id="cat-icon" v-model="form.icon" required class="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white">
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
  </component>
</template>

<script setup lang="ts">
import DashboardLayout from '../../components/DashboardLayout.vue';
import { ref, reactive, watch, computed } from 'vue';
import { useCategoriesStore } from '../../stores/category/categories';
import { useToast } from 'vue-toast-notification';
import debounce from 'lodash.debounce';
import { isValidIcon } from '../../utils/iconValidation';
import type { Category, CategoryFilters, CategoryType } from '../../types/category/category';

const store = useCategoriesStore();
const categories = computed(() => Array.isArray(store.categories) ? store.categories : []);
const loading = computed(() => store.loading);
const filters = reactive<CategoryFilters>({ ...store.filters });

// Debounce para el search
const debouncedFetch = debounce(() => {
  store.fetchAll({ ...filters });
}, 400);

watch(
  () => filters.search,
  () => {
    debouncedFetch();
  }
);

function fetch() {
  filterError.value = null;
  try {
    store.fetchAll({ ...filters });
  } catch (e: any) {
    filterError.value = e?.message || 'Error al filtrar categorías';
  }
}

watch(
  () => [filters.type, filters.is_active, filters.color],
  () => {
    store.fetchAll({ ...filters });
  }
);

const toast = useToast();

const showCreate = ref(false);
const editing = ref<Category | null>(null);
const form = reactive<{ name: string; type: CategoryType | ''; color: string; icon: string; is_active: boolean }>({
  name: '',
  type: '',
  color: '#6366F1',
  icon: '',
  is_active: true,
});
const submitting = ref(false);

// Estado de error para el filtro
const filterError = ref<string | null>(null);
const formError = ref<string | null>(null);

const iconOptions = [
  { value: 'fas fa-home', label: 'Casa' },
  { value: 'fas fa-utensils', label: 'Comida' },
  { value: 'fas fa-car', label: 'Auto' },
  { value: 'fas fa-shopping-cart', label: 'Compras' },
  { value: 'fas fa-wallet', label: 'Cartera' },
  { value: 'fas fa-money-bill-wave', label: 'Dinero' },
  { value: 'fas fa-briefcase', label: 'Trabajo' },
  { value: 'fas fa-heart', label: 'Salud' },
  { value: 'fas fa-graduation-cap', label: 'Educación' },
  { value: 'fas fa-bolt', label: 'Servicios' },
  { value: 'fas fa-plane', label: 'Viajes' },
  { value: 'fas fa-gift', label: 'Regalo' },
  { value: 'fas fa-credit-card', label: 'Tarjeta' },
  { value: 'fas fa-coins', label: 'Ahorro' },
  { value: 'fas fa-receipt', label: 'Factura' },
];

function edit(cat: Category) {
  editing.value = cat;
  Object.assign(form, {
    name: cat.name,
    type: cat.type,
    color: cat.color,
    icon: cat.icon,
    is_active: cat.is_active,
  });
  showCreate.value = false;
}

function closeModal() {
  showCreate.value = false;
  editing.value = null;
  Object.assign(form, { name: '', type: '', color: '#6366F1', icon: '', is_active: true });
  submitting.value = false;
}

// Validación extra en el formulario
async function submitForm() {
  formError.value = null;
  if (!form.type) {
    formError.value = 'Selecciona un tipo de categoría';
    toast.error('Selecciona un tipo de categoría');
    return;
  }
  if (!form.icon || !isValidIcon(form.icon, iconOptions)) {
    formError.value = 'Selecciona un icono válido';
    toast.error('Selecciona un icono válido para la categoría');
    return;
  }
  submitting.value = true;
  try {
    if (editing.value) {
      await store.update(editing.value.id, { ...form, type: form.type as CategoryType });
      toast.success('Categoría actualizada');
    } else {
      await store.create({ ...form, type: form.type as CategoryType });
      toast.success('Categoría creada');
    }
    closeModal();
    fetch();
  } catch (e: any) {
    toast.error(e?.message || 'Error al guardar');
  } finally {
    submitting.value = false;
  }
}

async function remove(id: number) {
  try {
    await store.remove(id);
    toast.success('Categoría eliminada');
    fetch();
  } catch (e: any) {
    toast.error(e?.message || 'Error al eliminar');
  }
}
async function restore(id: number) {
  try {
    await store.restore(id);
    toast.success('Categoría restaurada');
    fetch();
  } catch (e: any) {
    toast.error(e?.message || 'Error al restaurar');
  }
}
async function toggleStatus(id: number) {
  try {
    await store.toggleStatus(id);
    toast.success('Estado actualizado');
    fetch();
  } catch (e: any) {
    toast.error(e?.message || 'Error al cambiar estado');
  }
}

// Inicial
fetch();
</script>

<style scoped>
.animate-pop {
  animation: pop 0.2s cubic-bezier(.4,2,.6,1) both;
}
@keyframes pop {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
