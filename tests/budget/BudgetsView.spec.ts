import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

// Mock stores first
vi.mock('../../src/stores/budget/budgets', () => ({
  useBudgetsStore: vi.fn()
}));

vi.mock('../../src/stores/category/categories', () => ({
  useCategoriesStore: vi.fn()
}));

import BudgetsView from '../../src/views/budget/Budgets.vue';
import { useBudgetsStore } from '../../src/stores/budget/budgets';
import { useCategoriesStore } from '../../src/stores/category/categories';
import type { Budget } from '../../src/types/budget/budget';
import type { Category } from '../../src/types/category/category';

// Mock FontAwesome
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<i><slot /></i>',
  },
}));

// Mock vue-toast-notification
vi.mock('vue-toast-notification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

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

const mockCategory: Category = {
  id: 1,
  name: 'Groceries',
  icon: 'shopping-cart',
  color: '#10B981',
  user_id: 1,
  is_active: true,
  created_at: '2024-01-01T00:00:00.000000Z',
  updated_at: '2024-01-01T00:00:00.000000Z',
  deleted_at: null
};

describe('Budgets.vue', () => {
  let pinia: any;
  let router: any;
  let mockBudgetsStore: any;
  let mockCategoriesStore: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/budgets', component: BudgetsView }]
    });

    // Create mock stores
    mockBudgetsStore = {
      budgets: [mockBudget],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 15,
        total: 1,
      },
      filters: {},
      activeBudgets: [mockBudget],
      totalAmount: 500,
      activeAmount: 500,
      fetchAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      toggleStatus: vi.fn(),
      restore: vi.fn(),
    };

    mockCategoriesStore = {
      categories: [mockCategory],
      fetchAll: vi.fn(),
    };

    // Mock the store hooks
    vi.mocked(useBudgetsStore).mockReturnValue(mockBudgetsStore);
    vi.mocked(useCategoriesStore).mockReturnValue(mockCategoriesStore);
  });

  it('muestra la lista de presupuestos', async () => {
    const wrapper = mount(BudgetsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          DashboardLayout: {
            template: '<div><slot /></div>',
          },
          MetricCard: {
            template: '<div data-testid="metric-card"><slot /></div>',
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="budgets-title"]').text()).toBe('Presupuestos');
    expect(wrapper.find('[data-testid="budget-card"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Groceries Budget');
    expect(wrapper.text()).toContain('$500.00');
  });
  it('abre el modal de nuevo presupuesto', async () => {
    const wrapper = mount(BudgetsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          DashboardLayout: {
            template: '<div><slot /></div>',
          },
          MetricCard: {
            template: '<div data-testid="metric-card"><slot /></div>',
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    const newBudgetBtn = wrapper.find('[data-testid="new-budget-btn"]');
    expect(newBudgetBtn.exists()).toBe(true);

    await newBudgetBtn.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="budget-modal"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="modal-title"]').text()).toBe('Nuevo presupuesto');
  });  it('valida el formulario y muestra errores', async () => {
    const wrapper = mount(BudgetsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          DashboardLayout: {
            template: '<div><slot /></div>',
          },
          MetricCard: {
            template: '<div data-testid="metric-card"><slot /></div>',
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    // Open modal
    await wrapper.find('[data-testid="new-budget-btn"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Try to submit empty form by triggering form submit event instead of clicking button
    const form = wrapper.find('form');
    await form.trigger('submit');
    await wrapper.vm.$nextTick();

    // Wait for validation to process
    await new Promise(resolve => setTimeout(resolve, 200));

    // Check if form error is shown - use a more flexible approach
    const formError = wrapper.find('[data-testid="form-error"]');
    expect(formError.exists()).toBe(true);
  });  it('llama a store.create al crear presupuesto válido', async () => {
    mockBudgetsStore.create.mockResolvedValue(mockBudget);

    const wrapper = mount(BudgetsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          DashboardLayout: {
            template: '<div><slot /></div>',
          },
          MetricCard: {
            template: '<div data-testid="metric-card"><slot /></div>',
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    // Open modal
    await wrapper.find('[data-testid="new-budget-btn"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Fill form with valid data
    const nameInput = wrapper.find('#budget-name');
    const categorySelect = wrapper.find('#budget-category');
    const amountInput = wrapper.find('#budget-amount');
    const periodSelect = wrapper.find('#budget-period');
    const startDateInput = wrapper.find('#budget-start-date');
    const endDateInput = wrapper.find('#budget-end-date');
    const descriptionTextarea = wrapper.find('#budget-description');

    await nameInput.setValue('Test Budget');
    await categorySelect.setValue('1');
    await amountInput.setValue('500');
    await periodSelect.setValue('monthly');
    await startDateInput.setValue('2024-01-01');
    await endDateInput.setValue('2024-12-31');
    await descriptionTextarea.setValue('Test Description');

    await wrapper.vm.$nextTick();

    // Submit form via form submission
    const form = wrapper.find('form');
    await form.trigger('submit');
    await wrapper.vm.$nextTick();

    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 200));    expect(mockBudgetsStore.create).toHaveBeenCalledWith({
      name: 'Test Budget',
      description: 'Test Description',
      amount: 500,
      period: 'monthly',
      category_id: 1,
      is_active: true,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
    });
  });  it('llama a store.update al editar presupuesto', async () => {
    mockBudgetsStore.update.mockResolvedValue(mockBudget);

    const wrapper = mount(BudgetsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          DashboardLayout: {
            template: '<div><slot /></div>',
          },
          MetricCard: {
            template: '<div data-testid="metric-card"><slot /></div>',
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    // Verify that budget card exists first
    expect(wrapper.find('[data-testid="budget-card"]').exists()).toBe(true);

    // Click edit button
    const editBtn = wrapper.find('[data-testid="edit-budget-btn"]');
    expect(editBtn.exists()).toBe(true);
    await editBtn.trigger('click');
    await wrapper.vm.$nextTick();    // Verify modal is open and form is populated
    expect(wrapper.find('[data-testid="budget-modal"]').exists()).toBe(true);
    expect((wrapper.find('#budget-name').element as HTMLInputElement).value).toBe('Groceries Budget');

    // Modify form
    await wrapper.find('#budget-name').setValue('Updated Budget');
    await wrapper.vm.$nextTick();

    // Submit form via form submission
    const form = wrapper.find('form');
    await form.trigger('submit');
    await wrapper.vm.$nextTick();

    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(mockBudgetsStore.update).toHaveBeenCalledWith(1, expect.objectContaining({
      name: 'Updated Budget',
    }));
  });

  it('llama a store.remove al eliminar presupuesto', async () => {
    mockBudgetsStore.remove.mockResolvedValue(undefined);

    const wrapper = mount(BudgetsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          DashboardLayout: {
            template: '<div><slot /></div>',
          },
          MetricCard: {
            template: '<div data-testid="metric-card"><slot /></div>',
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    // Click delete button
    await wrapper.find('[data-testid="delete-budget-btn"]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(mockBudgetsStore.remove).toHaveBeenCalledWith(1);
  });

  it('llama a store.toggleStatus al cambiar estado', async () => {
    mockBudgetsStore.toggleStatus.mockResolvedValue({ ...mockBudget, is_active: false });

    const wrapper = mount(BudgetsView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          DashboardLayout: {
            template: '<div><slot /></div>',
          },
          MetricCard: {
            template: '<div data-testid="metric-card"><slot /></div>',
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    // Click toggle button
    await wrapper.find('[data-testid="toggle-budget-btn"]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(mockBudgetsStore.toggleStatus).toHaveBeenCalledWith(1);
  });
});
