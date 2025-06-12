import { vi, describe, it, expect, beforeEach } from 'vitest';
vi.mock('../../src/services/category/categories', () => ({
  fetchCategories: vi.fn(async (filters) => ({ data: [{ id: 1, name: 'Test', type: 'income', color: '#fff', icon: 'fas fa-home', is_active: true }] })),
  createCategory: vi.fn(async () => ({ success: true })),
  updateCategory: vi.fn(async () => ({ success: true })),
  removeCategory: vi.fn(async () => ({ success: true })),
  deleteCategory: vi.fn(async () => ({ success: true })),
  restoreCategory: vi.fn(async () => ({ success: true })),
  toggleCategoryStatus: vi.fn(async () => ({ success: true })),
}));
import { setActivePinia, createPinia } from 'pinia';
import { useCategoriesStore } from '../../src/stores/category/categories';
import * as api from '../../src/services/category/categories';

describe('Categories Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    Object.values(api).forEach(fn => {
      if (typeof fn === 'function' && 'mockClear' in fn) (fn as any).mockClear();
    });
  });

  it('fetchAll sets categories and loading', async () => {
    const store = useCategoriesStore();
    await store.fetchAll({ search: 'Test' });
    expect(store.categories.length).toBeGreaterThan(0);
    expect(store.loading).toBe(false);
  });

  it('create, update, remove, restore, toggleStatus no lanzan error', async () => {
    const store = useCategoriesStore();
    await expect(store.create({ name: 'A', type: 'income', color: '#fff', icon: 'fas fa-home', is_active: true })).resolves.not.toThrow();
    await expect(store.update(1, { name: 'B', type: 'income', color: '#fff', icon: 'fas fa-home', is_active: true })).resolves.not.toThrow();
    await expect(store.remove(1)).resolves.not.toThrow();
    await expect(store.restore(1)).resolves.not.toThrow();
    await expect(store.toggleStatus(1)).resolves.not.toThrow();
  });
});
