import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Categories from '../../src/views/category/Categories.vue';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';

// Mock debounce to call immediately
vi.mock('lodash.debounce', () => ({ default: (fn: any) => fn }));

describe('Categories.vue', () => {
  it('muestra mensaje de error si no se selecciona icono', async () => {
    const wrapper = mount(Categories, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: { 'router-link': true, 'router-view': true },
      },
    });
    await wrapper.find('[data-testid="new-category-btn"]').trigger('click');
    await wrapper.find('input#cat-name').setValue('Test');
    await wrapper.find('select#cat-type').setValue('income');
    await wrapper.find('form').trigger('submit.prevent');
    await nextTick();
    expect(wrapper.find('[data-testid="form-error"]').text()).toContain('Selecciona un icono válido');
  });

  it('renderiza correctamente los filtros y cards', () => {
    const wrapper = mount(Categories, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
    expect(wrapper.find('input#cat-search').exists()).toBe(true);
    expect(wrapper.find('select#cat-type-filter').exists()).toBe(true);
    expect(wrapper.find('select#cat-status-filter').exists()).toBe(true);
  });
});
