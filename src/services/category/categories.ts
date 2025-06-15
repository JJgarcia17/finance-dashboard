import axios from 'axios';
import { getCommonHeaders } from '../common/headers';
import type { CategoryFilters, CategoryPayload } from '../../types/category/category';

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE = `${API_URL}/categories`;

// El servicio solo retorna datos o lanza errores, sin feedback visual ni toasts

export async function fetchCategories(filters: CategoryFilters = {}) {
  // Asegura que los filtros se envíen como objeto plano, sin valores undefined/null

  const params: Record<string, any> = {};
  for (const key in filters) {
    const value = (filters as Record<string, any>)[key];
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value;
    }
  }
  const { data } = await axios.get(BASE, { params, headers: getCommonHeaders() });
  return data;
}

export async function fetchCategory(id: number) {
  const { data } = await axios.get(`${BASE}/${id}`, { headers: getCommonHeaders() });
  return data;
}

export async function createCategory(payload: CategoryPayload) {
  const { data } = await axios.post(BASE, payload, { headers: getCommonHeaders() });
  return data;
}

export async function updateCategory(id: number, payload: Partial<CategoryPayload>) {
  const { data } = await axios.put(`${BASE}/${id}`, payload, { headers: getCommonHeaders() });
  return data;
}

export async function deleteCategory(id: number) {
  const { data } = await axios.delete(`${BASE}/${id}`, { headers: getCommonHeaders() });
  return data;
}

export async function restoreCategory(id: number) {
  const { data } = await axios.post(`${BASE}/${id}/restore`, {}, { headers: getCommonHeaders() });
  return data;
}

export async function toggleCategoryStatus(id: number) {
  const { data } = await axios.post(`${BASE}/${id}/toggle-status`, {}, { headers: getCommonHeaders() });
  return data;
}
