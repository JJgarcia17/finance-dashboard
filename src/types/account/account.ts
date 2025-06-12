// TypeScript types for Account, based on backend AccountResource and Account model

export interface AccountUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AccountType =
  | 'bank'
  | 'credit_card'
  | 'cash'
  | 'savings'
  | 'investment'
  | 'loan'
  | 'other';

export type AccountCurrency = 'USD' | 'EUR' | 'MXN' | 'GBP' | 'CAD' | 'COP'  | 'ARS' | 'BRL' | 'CLP' | 'PEN' | 'UYU' | 'VEF' | 'PYG' | 'CRC' | 'NIO' | 'HNL' | 'GTQ' | 'SVC' | 'XAF' | 'XOF' | 'XPF';

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  currency: AccountCurrency;
  initial_balance: string; // decimal as string
  current_balance: string; // decimal as string
  color: string | null;
  icon: string | null;
  description: string | null;
  is_active: boolean;
  include_in_total: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // Computed fields
  type_label: string;
  status: string;
  balance_difference: string; // decimal as string
  formatted_current_balance: string;
  formatted_initial_balance: string;

  // Relations
  user?: AccountUser;

  // Metadata
  can_edit: boolean;
  can_delete: boolean;
  transactions_count?: number;
}

export interface AccountFilters {
  search?: string;
  type?: AccountType;
  currency?: AccountCurrency;
  is_active?: boolean;
  include_in_total?: boolean;
  page?: number;
  per_page?: number;
}

export interface AccountPayload {
  name: string;
  type: AccountType;
  currency: AccountCurrency;
  initial_balance: string;
  color?: string | null;
  icon?: string | null;
  description?: string | null;
  is_active?: boolean;
  include_in_total?: boolean;
}
