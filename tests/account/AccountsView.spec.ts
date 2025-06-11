import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Accounts from '../../src/views/account/Accounts.vue';
import { createTestingPinia } from '@pinia/testing';
import { useAccountsStore } from '../../src/stores/account/accounts';
import { setActivePinia } from 'pinia';

// Mock toast
vi.mock('vue-toast-notification', () => ({ useToast: () => ({ error: vi.fn(), success: vi.fn() }) }));

describe('Accounts.vue', () => {
  let store: ReturnType<typeof useAccountsStore>;
  let wrapper: any;

  beforeEach(() => {
    const pinia = createTestingPinia({
      initialState: {
        accounts: {
          accounts: [
            {
              id: 1,
              name: 'Cuenta Principal',
              type: 'bank',
              currency: 'MXN',
              initial_balance: '1000',
              current_balance: '1000',
              color: '#6366F1',
              icon: 'fas fa-university',
              description: '',
              is_active: true,
              include_in_total: true,
              created_at: '',
              updated_at: '',
              deleted_at: null,
              type_label: 'Banco',
              status: 'Activa',
              balance_difference: '0',
              formatted_current_balance: '1,000.00',
              formatted_initial_balance: '1,000.00',
              can_edit: true,
              can_delete: true,
              transactions_count: 0,
            },
          ],
          loading: false,
        },
      },
      createSpy: vi.fn,
    });
    setActivePinia(pinia);
    store = useAccountsStore();
    store.fetchAll = vi.fn(); // Mock para evitar sobreescritura
    wrapper = mount(Accounts, {
      global: {
        plugins: [pinia],
        stubs: ['DashboardLayout'],
      },
    });
  });

  it('muestra la lista de cuentas', async () => {
    expect(wrapper.text()).toContain('Cuenta Principal');
    expect(wrapper.findAll('.account-card').length).toBe(1);
  });

  it('abre el modal de nueva cuenta', async () => {
    await wrapper.find('[data-testid="new-account-btn"]').trigger('click');
    expect(wrapper.text()).toContain('Nueva cuenta');
  });

  it('valida el formulario y muestra errores', async () => {
    await wrapper.find('[data-testid="new-account-btn"]').trigger('click');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.text()).toMatch(/obligatorio|Selecciona/);
  });

  it('llama a store.create al crear cuenta válida', async () => {
    await wrapper.find('[data-testid="new-account-btn"]').trigger('click');
    // Completa el formulario
    await wrapper.find('#acc-name').setValue('Cuenta Test');
    await wrapper.find('#acc-type').setValue('bank');
    await wrapper.find('#acc-color').setValue('#6366F1');
    await wrapper.find('#acc-icon').setValue('fas fa-university');
    await wrapper.find('#acc-currency').setValue('MXN');
    await wrapper.find('#acc-initial-balance').setValue('100');
    store.create = vi.fn().mockResolvedValue({});
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.create).toHaveBeenCalled();
  });
  it('llama a store.update al editar cuenta', async () => {
    await wrapper.find('.icon-btn.edit').trigger('click');
    await flushPromises();
    store.update = vi.fn().mockResolvedValue({});
    await wrapper.find('form').trigger('submit.prevent');
    expect(store.update).toHaveBeenCalled();
  });
  it('llama a store.remove al eliminar cuenta', async () => {
    store.remove = vi.fn().mockResolvedValue({});
    await wrapper.find('.icon-btn.delete').trigger('click');
    expect(store.remove).toHaveBeenCalled();
  });
  it('llama a store.toggleStatus al cambiar estado', async () => {
    store.toggleStatus = vi.fn().mockResolvedValue({});
    await wrapper.find('.icon-btn.toggle').trigger('click');
    expect(store.toggleStatus).toHaveBeenCalled();
  });
});
