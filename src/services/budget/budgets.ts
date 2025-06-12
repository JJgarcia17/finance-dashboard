import axios from 'axios';
import { getCommonHeaders } from '../common/headers';
import type { Budget, BudgetFilters, CreateBudgetData, UpdateBudgetData } from '../../types/budget/budget';

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE = `${API_URL}/budgets`;

// Servicio de presupuestos: solo retorna datos o lanza errores, sin feedback visual

export async function fetchBudgets(filters: BudgetFilters = {}) {
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

export async function fetchBudget(id: number) {
  const { data } = await axios.get(`${BASE}/${id}`, { headers: getCommonHeaders() });
  return data;
}

export async function createBudget(payload: CreateBudgetData) {
  const { data } = await axios.post(BASE, payload, { headers: getCommonHeaders() });
  return data;
}

export async function updateBudget(id: number, payload: UpdateBudgetData) {
  const { data } = await axios.put(`${BASE}/${id}`, payload, { headers: getCommonHeaders() });
  return data;
}

export async function deleteBudget(id: number) {
  const { data } = await axios.delete(`${BASE}/${id}`, { headers: getCommonHeaders() });
  return data;
}

export async function restoreBudget(id: number) {
  const { data } = await axios.post(`${BASE}/${id}/restore`, {}, { headers: getCommonHeaders() });
  return data;
}

export async function toggleBudgetStatus(id: number) {
  const { data } = await axios.patch(`${BASE}/${id}/toggle-status`, {}, { headers: getCommonHeaders() });
  return data;
}

export async function fetchActiveBudgets() {
  const { data } = await axios.get(`${BASE}/budgets-active`, { headers: getCommonHeaders() });
  return data;
}

export async function fetchCurrentBudgets() {
  const { data } = await axios.get(`${BASE}/current`, { headers: getCommonHeaders() });
  return data;
}
