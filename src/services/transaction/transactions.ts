import axios from 'axios';
import { getCommonHeaders } from '../common/headers';
import type { TransactionFilters, TransactionPayload } from '../../types/transaction/transaction';

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE = `${API_URL}/transactions`;

// Servicio de transacciones: solo retorna datos o lanza errores, sin feedback visual

export async function fetchTransactions(filters: TransactionFilters = {}) {
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

export async function fetchTransaction(id: number) {
  const { data } = await axios.get(`${BASE}/${id}`, { headers: getCommonHeaders() });
  return data;
}

export async function createTransaction(payload: TransactionPayload) {
  const { data } = await axios.post(BASE, payload, { headers: getCommonHeaders() });
  return data;
}

export async function updateTransaction(id: number, payload: Partial<TransactionPayload>) {
  const { data } = await axios.put(`${BASE}/${id}`, payload, { headers: getCommonHeaders() });
  return data;
}

export async function deleteTransaction(id: number) {
  const { data } = await axios.delete(`${BASE}/${id}`, { headers: getCommonHeaders() });
  return data;
}

export async function restoreTransaction(id: number) {
  const { data } = await axios.post(`${BASE}/${id}/restore`, {}, { headers: getCommonHeaders() });
  return data;
}

export async function fetchTransactionStats() {
  const { data } = await axios.get(`${BASE}/stats`, { headers: getCommonHeaders() });
  return data;
}
