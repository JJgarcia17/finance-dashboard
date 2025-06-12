import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Categories from '../../src/views/category/Categories.vue';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock vue-toast-notification
vi.mock('vue-toast-notification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('Categories.vue', () => {
  let router;

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/categories', component: Categories },
      ],
    });
    router.push('/categories');
    await router.isReady();
  });

  it('muestra mensaje de error si no se selecciona icono', async () => {
    const wrapper = mount(Categories, {
      global: {
        plugins: [
          createTestingPinia({ 
            createSpy: vi.fn,
            initialState: {
              categories: {
                categories: [],
                loading: false,
                filters: { search: '', type: '', is_active: '', color: '' }
              }
            }
          }),
          router
        ],
        stubs: { 
          'DashboardLayout': {
            template: '<div><slot /></div>'
          }
        },
      },
    });

    // Esperar a que el componente se monte completamente
    await nextTick();

    // Buscar el botón por data-testid
    const newCategoryBtn = wrapper.find('[data-testid="new-category-btn"]');
    expect(newCategoryBtn.exists()).toBe(true);
    
    await newCategoryBtn.trigger('click');
    await nextTick();

    // Llenar el formulario sin seleccionar icono
    const nameInput = wrapper.find('input#cat-name');
    const typeSelect = wrapper.find('select#cat-type');
    
    expect(nameInput.exists()).toBe(true);
    expect(typeSelect.exists()).toBe(true);
    
    await nameInput.setValue('Test Category');
    await typeSelect.setValue('income');
    await nextTick();

    // Enviar formulario
    const form = wrapper.find('form');
    expect(form.exists()).toBe(true);
    
    await form.trigger('submit.prevent');
    await nextTick();

    // Verificar que aparece el mensaje de error
    const errorDiv = wrapper.find('[data-testid="form-error"]');
    expect(errorDiv.exists()).toBe(true);
    expect(errorDiv.text()).toContain('Selecciona un icono válido');
  });

  it('renderiza correctamente los filtros y cards', async () => {
    const wrapper = mount(Categories, {
      global: {
        plugins: [
          createTestingPinia({ 
            createSpy: vi.fn,
            initialState: {
              categories: {
                categories: [],
                loading: false,
                filters: { search: '', type: '', is_active: '', color: '' }
              }
            }
          }),
          router
        ],
        stubs: { 
          'DashboardLayout': {
            template: '<div><slot /></div>'
          }
        },
      },
    });

    // Esperar a que el componente se monte
    await nextTick();
    
    // Verificar que los elementos de filtro existen
    expect(wrapper.find('input#cat-search').exists()).toBe(true);
    expect(wrapper.find('select#cat-type-filter').exists()).toBe(true);
    expect(wrapper.find('select#cat-status-filter').exists()).toBe(true);
  });
});
