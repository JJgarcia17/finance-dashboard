import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Transactions from '../../src/views/transaction/Transactions.vue';
import { createTestingPinia } from '@pinia/testing';
import { useTransactionsStore } from '../../src/stores/transaction/transactions';
import { setActivePinia } from 'pinia';

// Mock toast
vi.mock('vue-toast-notification', () => ({ useToast: () => ({ error: vi.fn(), success: vi.fn() }) }));

describe('Transactions.vue', () => {
  let store: ReturnType<typeof useTransactionsStore>;
  let wrapper: any;

  beforeEach(() => {
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
          loading: false,
          stats: {
            total_transactions: 1,
            total_income: 1000,
            total_expenses: 0,
          },
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
    });
    store.fetchStats = vi.fn();
    wrapper = mount(Transactions, {
      global: {
        plugins: [pinia],
        stubs: ['DashboardLayout', 'MetricCard'],
      },
    });
  });

  it('muestra la lista de transacciones', async () => {
    expect(wrapper.text()).toContain('Salario');
    expect(wrapper.findAll('tbody tr').length).toBeGreaterThan(0);
  });

  it('abre el modal de nueva transacción', async () => {
    await wrapper.find('[data-testid="new-transaction-btn"]').trigger('click');
    expect(wrapper.text()).toContain('Nueva transacción');
  });

  it('valida el formulario y muestra errores', async () => {
    await wrapper.find('[data-testid="new-transaction-btn"]').trigger('click');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.text()).toMatch(/obligatorio|Selecciona/);
  });

  it('llama a store.create al crear transacción válida', async () => {
    await wrapper.find('[data-testid="new-transaction-btn"]').trigger('click');
    await wrapper.find('#trx-amount').setValue('500');
    await wrapper.find('#trx-type').setValue('income');
    await wrapper.find('#trx-account').setValue('1');
    await wrapper.find('#trx-category').setValue('1');
    await wrapper.find('#trx-date').setValue('2025-06-10');
    await wrapper.find('#trx-description').setValue('Bono');
    store.create = vi.fn().mockResolvedValue({});
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.create).toHaveBeenCalled();
  });
  it('llama a store.update al editar transacción', async () => {
    await wrapper.find('button[aria-label="Editar transacción"]').trigger('click');
    await flushPromises();
    store.update = vi.fn().mockResolvedValue({});
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.update).toHaveBeenCalled();
  });
  it('llama a store.remove al eliminar transacción', async () => {
    store.remove = vi.fn().mockResolvedValue({});
    await wrapper.find('button[aria-label="Eliminar transacción"]').trigger('click');
    expect(store.remove).toHaveBeenCalled();
  });
});
