export type BudgetPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Budget {
  id: number;
  user_id: number;
  category: {
    id: number;
    name: string;
    color: string;
  };
  name: string;
  amount: string;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BudgetFilters {
  category_id?: number;
  period?: BudgetPeriod;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
}

export interface CreateBudgetData {
  category_id: number;
  name: string;
  amount: number; // Cambiar de string a number
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  is_active?: boolean;
  description?: string | null; // Permitir null
}

export interface UpdateBudgetData {
  category_id?: number;
  name?: string;
  amount?: number; // Cambiar de string a number
  period?: BudgetPeriod;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  description?: string | null; // Permitir null
}

export interface BudgetStats {
  total_budgets: number;
  active_budgets: number;
  total_amount: number;
  spent_amount: number;
  remaining_amount: number;
}
