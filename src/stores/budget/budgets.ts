import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as api from '../../services/budget/budgets';
import type { Budget, BudgetFilters, CreateBudgetData, UpdateBudgetData } from '../../types/budget/budget';

export const useBudgetsStore = defineStore('budgets', () => {
  // State
  const budgets = ref<Budget[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
  });
  const filters = ref<BudgetFilters>({});

  // Computed
  const activeBudgets = computed(() => 
    budgets.value.filter(budget => budget.is_active)
  );

  const inactiveBudgets = computed(() => 
    budgets.value.filter(budget => !budget.is_active)
  );

  const totalAmount = computed(() => 
    budgets.value.reduce((sum, budget) => sum + parseFloat(budget.amount), 0)
  );

  const activeAmount = computed(() => 
    activeBudgets.value.reduce((sum, budget) => sum + parseFloat(budget.amount), 0)
  );  // Actions
  async function fetchAll(newFilters: BudgetFilters = {}) {
    loading.value = true;
    error.value = null;

    try {
      filters.value = { ...newFilters };
      const response = await api.fetchBudgets(filters.value);
      
      budgets.value = response.data;
      pagination.value = {
        currentPage: response.meta?.current_page || 1,
        lastPage: response.meta?.last_page || 1,
        perPage: response.meta?.per_page || 15,
        total: response.meta?.total || 0,
      };
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching budgets:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchOne(id: number): Promise<Budget | null> {
    loading.value = true;
    error.value = null;

    try {
      const budget = await api.fetchBudget(id);
      
      // Update budget in list if it exists
      const index = budgets.value.findIndex(b => b.id === id);
      if (index !== -1) {
        budgets.value[index] = budget.data;
      }
      
      return budget.data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching budget:', err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(data: CreateBudgetData): Promise<Budget | null> {
    loading.value = true;
    error.value = null;

    try {
      const newBudget = await api.createBudget(data);
      
      // Add to beginning of list
      budgets.value.unshift(newBudget.data);
      pagination.value.total += 1;
      
      return newBudget.data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error creating budget:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: number, data: UpdateBudgetData): Promise<Budget | null> {
    loading.value = true;
    error.value = null;

    try {
      const updatedBudget = await api.updateBudget(id, data);
      
      // Update in list
      const index = budgets.value.findIndex(b => b.id === id);
      if (index !== -1) {
        budgets.value[index] = updatedBudget.data;
      }
      
      return updatedBudget.data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating budget:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      await api.deleteBudget(id);
      
      // Remove from list
      const index = budgets.value.findIndex(b => b.id === id);
      if (index !== -1) {
        budgets.value.splice(index, 1);
        pagination.value.total -= 1;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error deleting budget:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function restore(id: number): Promise<Budget | null> {
    loading.value = true;
    error.value = null;

    try {
      const restoredBudget = await api.restoreBudget(id);
      
      // Add back to list
      budgets.value.unshift(restoredBudget.data);
      pagination.value.total += 1;
      
      return restoredBudget.data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error restoring budget:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function toggleStatus(id: number): Promise<Budget | null> {
    loading.value = true;
    error.value = null;

    try {
      const updatedBudget = await api.toggleBudgetStatus(id);
      
      // Update in list
      const index = budgets.value.findIndex(b => b.id === id);
      if (index !== -1) {
        budgets.value[index] = updatedBudget.data;
      }
      
      return updatedBudget.data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error toggling budget status:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchActive(): Promise<Budget[]> {
    loading.value = true;
    error.value = null;

    try {
      const activeBudgetsList = await api.fetchActiveBudgets();
      return activeBudgetsList.data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching active budgets:', err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchCurrent(): Promise<Budget[]> {
    loading.value = true;
    error.value = null;

    try {
      const currentBudgets = await api.fetchCurrentBudgets();
      return currentBudgets.data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching current budgets:', err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  function resetError() {
    error.value = null;
  }

  function clearBudgets() {
    budgets.value = [];
    pagination.value = {
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
      total: 0,
    };
  }

  return {
    // State
    budgets,
    loading,
    error,
    pagination,
    filters,
    
    // Computed
    activeBudgets,
    inactiveBudgets,
    totalAmount,
    activeAmount,
    
    // Actions
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    restore,
    toggleStatus,
    fetchActive,
    fetchCurrent,
    resetError,
    clearBudgets,
  };
});
