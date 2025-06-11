import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as api from '../../services/account/accounts';
import type { Account, AccountFilters, AccountPayload } from '../../types/account/account';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);
  const loading = ref(false);
  const error = ref('');
  const total = ref(0);
  const filters = ref<AccountFilters>({});
  const stats = ref<any>(null);

  function cleanFilters(params: AccountFilters) {
    const cleaned: Record<string, any> = {};
    for (const key in params) {
      let value = (params as Record<string, any>)[key];
      if (value === '' || value === null || value === undefined) continue;
      if (key === 'is_active' && typeof value === 'boolean') {
        cleaned[key] = value ? 1 : 0;
        continue;
      }
      if (key === 'include_in_total' && typeof value === 'boolean') {
        cleaned[key] = value ? 1 : 0;
        continue;
      }
      if ((key === 'type' || key === 'currency') && typeof value === 'string' && value.trim() !== '') {
        cleaned[key] = value;
        continue;
      }
      if (key === 'search' && typeof value === 'string' && value.trim() !== '') {
        cleaned[key] = String(value);
        continue;
      }
      if (key === 'page' || key === 'per_page') {
        cleaned[key] = value;
        continue;
      }
    }
    return cleaned as AccountFilters;
  }

  async function fetchAll(params: AccountFilters = {}) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.fetchAccounts(cleanFilters(params));
      // Soporte para respuesta paginada o no paginada
      if (Array.isArray(res.data)) {
        accounts.value = res.data;
        total.value = res.total || res.data.length;
      } else if (res.data && Array.isArray(res.data.accounts)) {
        accounts.value = res.data.accounts;
        total.value = res.data.total || res.data.accounts.length;
      } else {
        accounts.value = [];
        total.value = 0;
      }
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al cargar cuentas';
    } finally {
      loading.value = false;
    }
  }

  async function fetchOne(id: number) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.fetchAccount(id);
      return res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al cargar cuenta';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: AccountPayload) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.createAccount(payload);
      await fetchAll(filters.value);
      return res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al crear cuenta';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: number, payload: Partial<AccountPayload>) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.updateAccount(id, payload);
      await fetchAll(filters.value);
      return res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al actualizar cuenta';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: number) {
    loading.value = true;
    error.value = '';
    try {
      await api.deleteAccount(id);
      await fetchAll(filters.value);
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al eliminar cuenta';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function restore(id: number) {
    loading.value = true;
    error.value = '';
    try {
      await api.restoreAccount(id);
      await fetchAll(filters.value);
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al restaurar cuenta';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function toggleStatus(id: number) {
    loading.value = true;
    error.value = '';
    try {
      await api.toggleAccountStatus(id);
      await fetchAll(filters.value);
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al cambiar estado de cuenta';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchStats() {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.fetchAccountStats();
      stats.value = res.data;
      return res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al obtener estadísticas';
      stats.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    accounts,
    loading,
    error,
    total,
    filters,
    stats,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    restore,
    toggleStatus,
    fetchStats
  };
});
