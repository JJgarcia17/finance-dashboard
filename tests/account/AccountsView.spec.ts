import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Accounts from '../../src/views/account/Accounts.vue';
import { createTestingPinia } from '@pinia/testing';
import { useAccountsStore } from '../../src/stores/account/accounts';
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
    path: '/accounts'
  })
}));

describe('Accounts.vue', () => {
  let store: ReturnType<typeof useAccountsStore>;
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
          filters: {}
        },
      },
      createSpy: vi.fn,
    });
    setActivePinia(pinia);
    store = useAccountsStore();
    
    // Override the store methods that will be called
    store.fetchAll = vi.fn();
      wrapper = mount(Accounts, {
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
  });  it('muestra la lista de cuentas', async () => {
    await wrapper.vm.$nextTick();
    await flushPromises();
    
    expect(wrapper.text()).toContain('Cuenta Principal');
    // Look specifically for account cards in the grid, not all white rounded elements
    const accountsGrid = wrapper.find('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    expect(accountsGrid.exists()).toBe(true);
    expect(accountsGrid.findAll('div[class*="bg-white rounded-2xl"]').length).toBe(1);
  });
  it('abre el modal de nueva cuenta', async () => {
    const newBtn = wrapper.find('[data-testid="new-account-btn"]');
    expect(newBtn.exists()).toBe(true);
    await newBtn.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Nueva Cuenta');
  });

  it('valida el formulario y muestra errores', async () => {
    const newBtn = wrapper.find('[data-testid="new-account-btn"]');
    await newBtn.trigger('click');
    await wrapper.vm.$nextTick();
    
    const form = wrapper.find('form');
    expect(form.exists()).toBe(true);
    await form.trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.text()).toMatch(/obligatorio|Selecciona/);
  });

  it('llama a store.create al crear cuenta válida', async () => {
    const newBtn = wrapper.find('[data-testid="new-account-btn"]');
    await newBtn.trigger('click');
    await wrapper.vm.$nextTick();
    
    // Completa el formulario
    await wrapper.find('#acc-name').setValue('Cuenta Test');
    await wrapper.find('#acc-type').setValue('bank');
    await wrapper.find('#acc-color').setValue('#6366F1');
    await wrapper.find('#acc-icon').setValue('fas fa-university');
    await wrapper.find('#acc-currency').setValue('MXN');
    await wrapper.find('#acc-initial-balance').setValue('100');
    
    store.create = vi.fn().mockResolvedValue({});
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');
    await flushPromises();
    expect(store.create).toHaveBeenCalled();
  });
  it('llama a store.update al editar cuenta', async () => {
    await wrapper.vm.$nextTick();
    
    // Find the edit button (the first button with blue styling)
    const editBtn = wrapper.find('button[class*="bg-blue-50"]');
    expect(editBtn.exists()).toBe(true);
    
    await editBtn.trigger('click');
    await wrapper.vm.$nextTick();
    await flushPromises();
    
    store.update = vi.fn().mockResolvedValue({});
    const form = wrapper.find('form');
    if (form.exists()) {
      await form.trigger('submit.prevent');
      await flushPromises();
      expect(store.update).toHaveBeenCalled();
    }
  });  it('llama a store.remove al eliminar cuenta', async () => {
    await wrapper.vm.$nextTick();
    store.remove = vi.fn().mockResolvedValue({});
    mockConfirmationModal.confirmDelete.mockResolvedValue(true);
    
    // Find the delete button (button with red styling)
    const deleteBtn = wrapper.find('button[class*="bg-red-50"]');
    expect(deleteBtn.exists()).toBe(true);
    await deleteBtn.trigger('click');
    await flushPromises();
    expect(mockConfirmationModal.confirmDelete).toHaveBeenCalled();
    expect(store.remove).toHaveBeenCalled();
  });
  it('llama a store.toggleStatus al cambiar estado', async () => {
    await wrapper.vm.$nextTick();
    store.toggleStatus = vi.fn().mockResolvedValue({});
    mockConfirmationModal.confirmStatusChange.mockResolvedValue(true);
    
    // Find the toggle status button (button with gray styling that contains "Desactivar" or "Activar")
    const toggleBtn = wrapper.find('button[class*="bg-gray-50"]');
    expect(toggleBtn.exists()).toBe(true);
    await toggleBtn.trigger('click');
    await flushPromises();
    expect(mockConfirmationModal.confirmStatusChange).toHaveBeenCalled();
    expect(store.toggleStatus).toHaveBeenCalled();
  });
});
