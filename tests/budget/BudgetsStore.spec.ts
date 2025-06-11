import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBudgetsStore } from '../../src/stores/budget/budgets';
import * as api from '../../src/services/budget/budgets';
import type { Budget, CreateBudgetData } from '../../src/types/budget/budget';

// Mock the service
vi.mock('../../src/services/budget/budgets');

const mockBudget: Budget = {
  id: 1,
  name: 'Groceries Budget',
  description: 'Monthly grocery budget',
  amount: '500.00',
  period: 'monthly',
  category_id: 1,
  user_id: 1,
  is_active: true,
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  created_at: '2024-01-01T00:00:00.000000Z',
  updated_at: '2024-01-01T00:00:00.000000Z',
  deleted_at: null,
  category: {
    id: 1,
    name: 'Groceries',
    icon: 'shopping-cart',
    color: '#10B981',
    user_id: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
    deleted_at: null
  }
};

const mockResponse = {
  data: [mockBudget],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 1,
  }
};

describe('BudgetsStore', () => {
  let store: ReturnType<typeof useBudgetsStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useBudgetsStore();
    
    // Reset all mocks
    vi.clearAllMocks();
  });

  it('should fetch budgets successfully', async () => {
    vi.mocked(api.fetchBudgets).mockResolvedValue(mockResponse);

    await store.fetchAll();

    expect(store.budgets).toEqual([mockBudget]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.pagination.total).toBe(1);
  });
  it('should create budget successfully', async () => {
    const newBudgetData: CreateBudgetData = {
      name: 'New Budget',
      description: 'Test budget',
      amount: '300.00',
      period: 'monthly',
      category_id: 1,
      is_active: true,
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    };

    vi.mocked(api.createBudget).mockResolvedValue({ data: mockBudget });

    const result = await store.create(newBudgetData);

    expect(result).toEqual(mockBudget);
    expect(store.budgets).toHaveLength(1);
    expect(store.budgets[0]).toEqual(mockBudget);
    expect(api.createBudget).toHaveBeenCalledWith(newBudgetData);
  });
});
