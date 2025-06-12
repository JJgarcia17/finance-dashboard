// src/utils/iconValidation.ts
import type { IconOption } from '../types/category/category';

export function isValidIcon(icon: string, iconOptions: IconOption[]): boolean {
  return iconOptions.some(i => i.value === icon);
}
