import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Register from '../../src/views/auth/Register.vue';

function getPasswordInput(wrapper) {
  return wrapper.find('input#password');
}
function getConfirmPasswordInput(wrapper) {
  return wrapper.find('input#confirm_password');
}
function getPasswordEyeButton(wrapper) {
  return wrapper.findAll('button[aria-label="Mostrar/ocultar contraseña"]')[0];
}
function getConfirmPasswordEyeButton(wrapper) {
  return wrapper.findAll('button[aria-label="Mostrar/ocultar confirmar contraseña"]')[0];
}

describe('Register.vue - Mostrar/Ocultar contraseña', () => {
  it('por defecto los campos son de tipo password', () => {
    const wrapper = mount(Register);
    expect(getPasswordInput(wrapper).attributes('type')).toBe('password');
    expect(getConfirmPasswordInput(wrapper).attributes('type')).toBe('password');
  });

  it('al hacer clic en el ojito de contraseña cambia a tipo text y vuelve a password', async () => {
    const wrapper = mount(Register);
    const btn = getPasswordEyeButton(wrapper);
    const input = getPasswordInput(wrapper);
    expect(input.attributes('type')).toBe('password');
    await btn.trigger('click');
    expect(input.attributes('type')).toBe('text');
    await btn.trigger('click');
    expect(input.attributes('type')).toBe('password');
  });

  it('al hacer clic en el ojito de confirmar contraseña cambia a tipo text y vuelve a password', async () => {
    const wrapper = mount(Register);
    const btn = getConfirmPasswordEyeButton(wrapper);
    const input = getConfirmPasswordInput(wrapper);
    expect(input.attributes('type')).toBe('password');
    await btn.trigger('click');
    expect(input.attributes('type')).toBe('text');
    await btn.trigger('click');
    expect(input.attributes('type')).toBe('password');
  });

  it('el ícono cambia según el estado del ojito', async () => {
    const wrapper = mount(Register);
    const btn = getPasswordEyeButton(wrapper);
    // Por defecto debe mostrar el ícono de ojo cerrado
    expect(btn.html()).toContain('circle');
    await btn.trigger('click');
    // Ahora debe mostrar el ícono de ojo tachado
    expect(btn.html()).toContain('M3 3l18 18');
  });
});
