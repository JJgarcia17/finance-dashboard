export interface CurrencyStats {
  currency: string;
  total_income: number;
  total_expenses: number;
  net_balance: number;
  transaction_count?: number;
  account_count?: number;
  total_balance?: number;
}

export interface DashboardStats {
  account_stats: {
    total_accounts: number;
    active_accounts: number;
    by_currency: CurrencyStats[];
  };
  transaction_stats: CurrencyStats[];
}

export interface CurrencyDisplayInfo {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCY_INFO: Record<string, CurrencyDisplayInfo> = {
  'MXN': { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
  'USD': { code: 'USD', symbol: '$', name: 'Dólar Estadounidense' },
  'EUR': { code: 'EUR', symbol: '€', name: 'Euro' },
  'GBP': { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
  'CAD': { code: 'CAD', symbol: 'C$', name: 'Dólar Canadiense' },
  'COP': { code: 'COP', symbol: 'Col$', name: 'Peso Colombiano' },
  'ARS': { code: 'ARS', symbol: 'AR$', name: 'Peso Argentino' },
  'BRL': { code: 'BRL', symbol: 'R$', name: 'Real Brasileño' },
  'CLP': { code: 'CLP', symbol: 'CL$', name: 'Peso Chileno' },
  'PEN': { code: 'PEN', symbol: 'S/', name: 'Sol Peruano' },
};

export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = CURRENCY_INFO[currency] || { code: currency, symbol: '', name: currency };
  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: currencyInfo.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
