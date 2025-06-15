import { fetchAccountStats } from '../account/accounts';
import { fetchTransactionStats } from '../transaction/transactions';
import type { DashboardStats, CurrencyStats } from '../../types/dashboard/dashboard';

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [accountStatsResponse, transactionStatsResponse] = await Promise.all([
      fetchAccountStats(),
      fetchTransactionStats()
    ]);

    // Convert account stats by_currency to array format
    const accountStatsByCurrency: CurrencyStats[] = [];
    if (accountStatsResponse.data.by_currency) {
      Object.entries(accountStatsResponse.data.by_currency).forEach(([currency, stats]: [string, any]) => {
        accountStatsByCurrency.push({
          currency,
          total_income: 0,
          total_expenses: 0,
          net_balance: stats.total_balance || 0,
          account_count: stats.count || 0,
          total_balance: stats.total_balance || 0
        });
      });
    }

    return {
      account_stats: {
        total_accounts: accountStatsResponse.data.total_accounts || 0,
        active_accounts: accountStatsResponse.data.active_accounts || 0,
        by_currency: accountStatsByCurrency
      },
      transaction_stats: transactionStatsResponse.data || []
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}
