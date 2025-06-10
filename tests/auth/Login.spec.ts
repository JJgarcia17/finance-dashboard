import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import Login from '../../src/views/auth/Login.vue';

describe('Login.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('renderiza el formulario de login', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
        stubs: { 'router-link': true },
      },
    });
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('muestra error si las credenciales son incorrectas', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
        stubs: { 'router-link': true },
      },
    });
    // Accede a la variable error y asígnale el mensaje
    // @ts-ignore
    wrapper.vm.error = 'Credenciales incorrectas';
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="login-error"]').text()).toBe('Credenciales incorrectas');
  });
});