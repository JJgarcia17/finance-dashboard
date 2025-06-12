import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as api from '../../services/category/categories';
import type { Category, CategoryFilters, CategoryPayload } from '../../types/category/category';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref('');
  const total = ref(0);
  const filters = ref<CategoryFilters>({});

  function cleanFilters(params: CategoryFilters) {
    const cleaned: Record<string, any> = {};
    for (const key in params) {
      let value = (params as Record<string, any>)[key];
      if (value === '' || value === null || value === undefined) continue;
      // is_active: enviar 1 (activo) o 0 (inactivo)
      if (key === 'is_active' && typeof value === 'boolean') {
        cleaned[key] = value ? 1 : 0;
        continue;
      }
      // type, color: solo strings no vacías
      if ((key === 'type' || key === 'color') && typeof value === 'string' && value.trim() !== '') {
        cleaned[key] = value;
        continue;
      }
      // search: solo si hay texto, y asegúrate de que el backend lo reciba como string
      if (key === 'search' && typeof value === 'string' && value.trim() !== '') {
        cleaned[key] = String(value);
        continue;
      }
    }
    // DEBUG: log para ver qué se envía
    // console.log('Filtros enviados a la API:', cleaned);
    return cleaned as CategoryFilters;
  }

  async function fetchAll(params: CategoryFilters = {}) {
    loading.value = true;
    error.value = '';
    try {
   
      const res = await api.fetchCategories(cleanFilters(params));
      // Soporte para respuesta paginada o no paginada
      if (Array.isArray(res.data)) {
        categories.value = res.data;
        total.value = res.total || res.data.length;
      } else if (res.data && Array.isArray(res.data.data)) {
        categories.value = res.data.data;
        total.value = res.data.total || res.data.data.length;
      } else {
        categories.value = [];
        total.value = 0;
      }
    } catch (e: any) {
      error.value = e?.message || 'Error al cargar categorías';
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: CategoryPayload) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.createCategory(payload);
      await fetchAll(filters.value);
      return res.data;
    } catch (e: any) {
      error.value = e?.message || 'Error al crear categoría';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: number, payload: Partial<CategoryPayload>) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.updateCategory(id, payload);
      await fetchAll(filters.value);
      return res.data;
    } catch (e: any) {
      error.value = e?.message || 'Error al actualizar categoría';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: number) {
    loading.value = true;
    error.value = '';
    try {
      await api.deleteCategory(id);
      await fetchAll(filters.value);
    } catch (e: any) {
      error.value = e?.message || 'Error al eliminar categoría';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function restore(id: number) {
    loading.value = true;
    error.value = '';
    try {
      await api.restoreCategory(id);
      await fetchAll(filters.value);
    } catch (e: any) {
      error.value = e?.message || 'Error al restaurar categoría';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function toggleStatus(id: number) {
    loading.value = true;
    error.value = '';
    try {
      await api.toggleCategoryStatus(id);
      await fetchAll(filters.value);
    } catch (e: any) {
      error.value = e?.message || 'Error al cambiar estado';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function $reset() {
    categories.value = [];
    loading.value = false;
    error.value = '';
    total.value = 0;
    filters.value = {};
  }

  return {
    categories,
    loading,
    error,
    total,
    filters,
    fetchAll,
    create,
    update,
    remove,
    restore,
    toggleStatus,
    $reset,
  };
});
