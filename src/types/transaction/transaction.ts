// Tipos y modelo para Transaction, siguiendo el patrón de account.ts y category.ts

export type TransactionType = 'income' | 'expense' | 'transfer';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: number;
  account_id: number;
  category_id: number;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string; // YYYY-MM-DD
  reference_number?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  account?: any; // Resumido, se puede tipar mejor si se requiere
  category?: any; // Resumido, se puede tipar mejor si se requiere
  can_edit?: boolean;
  can_delete?: boolean;
}

export interface TransactionFilters {
  search?: string;
  type?: TransactionType;
  account_id?: number;
  category_id?: number;
  min_date?: string;
  max_date?: string;
  page?: number;
  per_page?: number;
}

export interface TransactionPayload {
  account_id: number;
  category_id: number;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  reference_number?: string | null;
  notes?: string | null;
}
