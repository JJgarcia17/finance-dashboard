import axios from 'axios';
import { getCommonHeaders } from '../common/headers';
import type { Account, AccountFilters, AccountPayload } from '../../types/account/account';

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE = `${API_URL}/accounts`;

// Servicio de cuentas: solo retorna datos o lanza errores, sin feedback visual

export async function fetchAccounts(filters: AccountFilters = {}) {
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

export async function fetchAccount(id: number) {
  const { data } = await axios.get(`${BASE}/${id}`, { headers: getCommonHeaders() });
  return data;
}

export async function createAccount(payload: AccountPayload) {
  const { data } = await axios.post(BASE, payload, { headers: getCommonHeaders() });
  return data;
}

export async function updateAccount(id: number, payload: Partial<AccountPayload>) {
  const { data } = await axios.put(`${BASE}/${id}`, payload, { headers: getCommonHeaders() });
  return data;
}

export async function deleteAccount(id: number) {
  const { data } = await axios.delete(`${BASE}/${id}`, { headers: getCommonHeaders() });
  return data;
}

export async function restoreAccount(id: number) {
  const { data } = await axios.post(`${BASE}/${id}/restore`, {}, { headers: getCommonHeaders() });
  return data;
}

export async function toggleAccountStatus(id: number) {
  const { data } = await axios.patch(`${BASE}/${id}/toggle-status`, {}, { headers: getCommonHeaders() });
  return data;
}

export async function fetchAccountStats() {
  const { data } = await axios.get(`${BASE}/stats`, { headers: getCommonHeaders() });
  return data;
}
