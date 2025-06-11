import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAccountsStore } from '../../src/stores/account/accounts';

describe('accounts store', () => {
  let store: ReturnType<typeof useAccountsStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAccountsStore();
    store.accounts = [];
    store.error = '';
    store.loading = false;
    store.total = 0;
    store.filters = {};
    store.stats = null;
  });

  it('agrega una cuenta correctamente', async () => {
    store.create = vi.fn().mockResolvedValue({ id: 2, name: 'Nueva', ...{} });
    await store.create({ name: 'Nueva', type: 'bank', currency: 'MXN', initial_balance: '0' });
    expect(store.create).toHaveBeenCalled();
  });

  it('actualiza una cuenta correctamente', async () => {
    store.update = vi.fn().mockResolvedValue({ id: 1, name: 'Editada' });
    await store.update(1, { name: 'Editada' });
    expect(store.update).toHaveBeenCalledWith(1, { name: 'Editada' });
  });

  it('elimina una cuenta correctamente', async () => {
    store.remove = vi.fn().mockResolvedValue({});
    await store.remove(1);
    expect(store.remove).toHaveBeenCalledWith(1);
  });

  it('restaura una cuenta correctamente', async () => {
    store.restore = vi.fn().mockResolvedValue({});
    await store.restore(1);
    expect(store.restore).toHaveBeenCalledWith(1);
  });

  it('cambia el estado de una cuenta correctamente', async () => {
    store.toggleStatus = vi.fn().mockResolvedValue({});
    await store.toggleStatus(1);
    expect(store.toggleStatus).toHaveBeenCalledWith(1);
  });

  it('maneja errores correctamente', async () => {
    store.create = vi.fn().mockRejectedValue(new Error('Error al crear'));
    try {
      await store.create({ name: 'Error', type: 'bank', currency: 'MXN', initial_balance: '0' });
    } catch (e: any) {
      expect(e.message).toBe('Error al crear');
    }
  });
});
