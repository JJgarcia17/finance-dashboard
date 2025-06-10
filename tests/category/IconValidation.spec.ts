import { describe, it, expect } from 'vitest';
import { isValidIcon } from '../../src/utils/iconValidation';

const iconOptions = [
  { value: 'fas fa-home', label: 'Casa' },
  { value: 'fas fa-utensils', label: 'Comida' },
];

describe('isValidIcon', () => {
  it('valida iconos permitidos', () => {
    expect(isValidIcon('fas fa-home', iconOptions)).toBe(true);
    expect(isValidIcon('fas fa-utensils', iconOptions)).toBe(true);
  });
  it('rechaza iconos no permitidos', () => {
    expect(isValidIcon('fas fa-hacker', iconOptions)).toBe(false);
    expect(isValidIcon('', iconOptions)).toBe(false);
  });
});
