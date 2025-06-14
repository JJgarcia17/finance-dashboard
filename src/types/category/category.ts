// Tipos y modelo para Category

export type CategoryType = 'income' | 'expense';

export interface IconOption {
  value: string;
  label: string;
  category?: 'general' | 'transport' | 'food' | 'entertainment' | 'shopping' | 'health' | 'education' | 'business';
}

export interface Category {
  id: number;
  user_id: number;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CategoryFilters {
  search?: string;
  type?: CategoryType;
  color?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface CategoryPayload {
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  is_active?: boolean;
}

export interface IconOption {
  value: string;
  label: string;
}
