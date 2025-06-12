import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as api from '../../services/transaction/transactions';
import type { Transaction, TransactionFilters, TransactionPayload } from '../../types/transaction/transaction';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const error = ref('');
  const total = ref(0);
  const filters = ref<TransactionFilters>({});
  const stats = ref<any>(null);

  function cleanFilters(params: TransactionFilters) {
    const cleaned: Record<string, any> = {};
    for (const key in params) {
      let value = (params as Record<string, any>)[key];
      if (value === '' || value === null || value === undefined) continue;
      // Eliminar is_recurring del filtrado
      if (key === 'is_recurring') continue;
      cleaned[key] = value;
    }
    return cleaned as TransactionFilters;
  }

  async function fetchAll(params: TransactionFilters = {}) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.fetchTransactions(cleanFilters(params));
      if (Array.isArray(res.data)) {
        transactions.value = res.data;
        total.value = res.total || res.data.length;
      } else if (res.data && Array.isArray(res.data.data)) {
        transactions.value = res.data.data;
        total.value = res.data.total || res.data.data.length;
      } else {
        transactions.value = [];
        total.value = 0;
      }
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al cargar transacciones';
    } finally {
      loading.value = false;
    }
  }

  async function fetchOne(id: number) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.fetchTransaction(id);
      return res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al cargar transacción';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: TransactionPayload) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.createTransaction(payload);
      await fetchAll(filters.value);
      return res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al crear transacción';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: number, payload: Partial<TransactionPayload>) {
    loading.value = true;
    error.value = '';
    try {
      const res = await api.updateTransaction(id, payload);
      await fetchAll(filters.value);
      return res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al actualizar transacción';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: number) {
    loading.value = true;
    error.value = '';
    try {
      await api.deleteTransaction(id);
      await fetchAll(filters.value);
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al eliminar transacción';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function restore(id: number) {
    loading.value = true;
    error.value = '';
    try {
      await api.restoreTransaction(id);
      await fetchAll(filters.value);
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message || 'Error al restaurar transacción';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchStats() {
    try {
      const res = await api.fetchTransactionStats();
      stats.value = res.data;
    } catch (e: any) {
      // No error fatal
    }
  }

  function $reset() {
    transactions.value = [];
    loading.value = false;
    error.value = '';
    total.value = 0;
    filters.value = {};
    stats.value = null;
  }

  return {
    transactions,
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
    fetchStats,
    $reset,
  };
});
