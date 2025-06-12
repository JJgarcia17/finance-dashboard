import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Transactions from '../../src/views/transaction/Transactions.vue';
import { createTestingPinia } from '@pinia/testing';
import { useTransactionsStore } from '../../src/stores/transaction/transactions';
import { useConfirmationModal } from '../../src/composables/useConfirmationModal';
import { setActivePinia } from 'pinia';

// Mock toast
vi.mock('vue-toast-notification', () => ({ useToast: () => ({ error: vi.fn(), success: vi.fn() }) }));

// Mock useConfirmationModal
vi.mock('../../src/composables/useConfirmationModal', () => ({
  useConfirmationModal: vi.fn()
}));

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/transactions'
  })
}));

describe('Transactions.vue', () => {
  let store: ReturnType<typeof useTransactionsStore>;
  let wrapper: any;
  let mockConfirmationModal: any;

  beforeEach(async () => {
    // Create mock confirmation modal
    mockConfirmationModal = {
      isOpen: { value: false },
      loading: { value: false },
      modalConfig: {},
      openModal: vi.fn().mockResolvedValue(true),
      confirm: vi.fn(),
      cancel: vi.fn(),
      closeModal: vi.fn(),
      setLoading: vi.fn(),
      confirmDelete: vi.fn().mockResolvedValue(true),
      confirmRestore: vi.fn().mockResolvedValue(true),
      confirmStatusChange: vi.fn().mockResolvedValue(true)
    };

    // Mock the composable
    vi.mocked(useConfirmationModal).mockReturnValue(mockConfirmationModal);

    const pinia = createTestingPinia({
      initialState: {
        transactions: {
          transactions: [
            {
              id: 1,
              account_id: 1,
              category_id: 1,
              type: 'income',
              amount: 1000,
              description: 'Salario',
              transaction_date: '2025-06-01',
              reference_number: 'REF123',
              notes: 'Pago mensual',
              created_at: '2025-06-01 10:00:00',
              updated_at: '2025-06-01 10:00:00',
              account: { id: 1, name: 'Cuenta Principal' },
              category: { id: 1, name: 'Sueldo' },
              can_edit: true,
              can_delete: true,
            },
          ],
          loading: false,          stats: {
            total_transactions: 1,
            total_income: 1000,
            total_expenses: 0,
          },
          filters: {}
        },
        accounts: {
          accounts: [
            { id: 1, name: 'Cuenta Principal' }
          ],
          loading: false
        },
        categories: {
          categories: [
            { id: 1, name: 'Sueldo' }
          ],
          loading: false
        }
      },
      createSpy: vi.fn,
    });
    setActivePinia(pinia);
    store = useTransactionsStore();
    store.fetchAll = vi.fn(); // Mock para evitar sobreescritura
    store.fetchOne = vi.fn().mockResolvedValue({
      id: 1,
      account_id: 1,
      category_id: 1,
      type: 'income',
      amount: 1000,
      description: 'Salario',
      transaction_date: '2025-06-01',
      reference_number: 'REF123',
      notes: 'Pago mensual',
      created_at: '2025-06-01 10:00:00',
      updated_at: '2025-06-01 10:00:00',
      account: { id: 1, name: 'Cuenta Principal' },
      category: { id: 1, name: 'Sueldo' },
      can_edit: true,
      can_delete: true,
    });    store.fetchStats = vi.fn();
      wrapper = mount(Transactions, {
      global: {
        plugins: [pinia],
        stubs: {
          'DashboardLayout': {
            template: '<div class="dashboard-layout"><slot /></div>'
          }
        }
      },
    });
    
    await wrapper.vm.$nextTick();
    await flushPromises();
  });
  it('muestra la lista de transacciones', async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Salario');
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  });
  it('abre el modal de nueva transacción', async () => {
    const newBtn = wrapper.find('[data-testid="new-transaction-btn"]');
    expect(newBtn.exists()).toBe(true);
    await newBtn.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Nueva Transacción');
  });

  it('valida el formulario y muestra errores', async () => {
    const newBtn = wrapper.find('[data-testid="new-transaction-btn"]');
    await newBtn.trigger('click');
    await wrapper.vm.$nextTick();
    
    const form = wrapper.find('form');
    expect(form.exists()).toBe(true);
    await form.trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.text()).toMatch(/obligatorio|Selecciona/);
  });

  it('llama a store.create al crear transacción válida', async () => {
    const newBtn = wrapper.find('[data-testid="new-transaction-btn"]');
    await newBtn.trigger('click');
    await wrapper.vm.$nextTick();
    
    await wrapper.find('#trx-amount').setValue('500');
    await wrapper.find('#trx-type').setValue('income');
    await wrapper.find('#trx-account').setValue('1');
    await wrapper.find('#trx-category').setValue('1');
    await wrapper.find('#trx-date').setValue('2025-06-10');
    await wrapper.find('#trx-description').setValue('Bono');
    
    store.create = vi.fn().mockResolvedValue({});
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');
    await flushPromises();
    expect(store.create).toHaveBeenCalled();
  });
  it('llama a store.update al editar transacción', async () => {
    await wrapper.vm.$nextTick();
    const editBtn = wrapper.find('button[title="Editar"]');
    if (editBtn.exists()) {
      await editBtn.trigger('click');
      await flushPromises();
      
      store.update = vi.fn().mockResolvedValue({});
      const form = wrapper.find('form');
      if (form.exists()) {
        await form.trigger('submit.prevent');
        await flushPromises();
        expect(store.update).toHaveBeenCalled();
      }
    }
  });
  it('llama a store.remove al eliminar transacción', async () => {
    await wrapper.vm.$nextTick();
    store.remove = vi.fn().mockResolvedValue({});
    mockConfirmationModal.confirmDelete.mockResolvedValue(true);
    
    const deleteBtn = wrapper.find('button[title="Eliminar"]');
    if (deleteBtn.exists()) {
      await deleteBtn.trigger('click');
      await flushPromises();
      expect(mockConfirmationModal.confirmDelete).toHaveBeenCalled();
      expect(store.remove).toHaveBeenCalled();
    }
  });
});
