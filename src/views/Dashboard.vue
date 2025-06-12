<template>
  <DashboardLayout>
    <div class="dashboard-container">
      <WelcomeBanner />
      
      <!-- Header Section -->
      <div class="dashboard-header mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p class="text-gray-600">Resumen financiero del {{ formatDate(new Date()) }}</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Última actualización: {{ formatTime(new Date()) }}</span>
        </div>
      </div>      <!-- Enhanced Metrics Cards Grid -->
      <div class="metrics-grid">
        <!-- Financial Summary Card (Main) -->
        <div class="metric-card metric-card-main">
          <div class="metric-card-header">
            <div class="metric-icon-container bg-gradient-to-br from-blue-500 to-indigo-600">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>            <div class="metric-details">
              <h3 class="metric-title">Resumen Financiero</h3>
              <p class="metric-subtitle">{{ getCurrentDateRange() }}</p>
            </div>
            <button class="show-more-btn" @click="router.push('/accounts')">Ver Cuentas</button>
          </div>
          <div class="metric-values">
            <div class="main-value">
              <span class="current-value">{{ formatCurrency(accountStats.total_balance || 0) }}</span>
              <span class="period-label">SALDO TOTAL</span>
            </div>
            <div class="comparison-value">
              <span class="previous-value">{{ formatCurrency(stats.net_balance || 0) }}</span>
              <span class="period-label">BALANCE NETO</span>
            </div>
          </div>
        </div>

        <!-- Monthly Transactions -->
        <div class="metric-card">
          <div class="metric-card-header">
            <div class="metric-icon-container bg-gradient-to-br from-green-500 to-emerald-600">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="8.5" cy="7" r="4" stroke="white" stroke-width="2"/>
                <path d="M20 8v6M23 11l-3-3-3 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>            <div class="metric-details">
              <h3 class="metric-title">Transacciones</h3>
              <p class="metric-subtitle">Este mes</p>
            </div>
            <button class="show-more-btn" @click="router.push('/transactions')">Ver Transacciones</button>
          </div>
          <div class="monthly-transactions">
            <div class="transactions-summary">
              <div class="transaction-item income">
                <div class="transaction-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M7 17l5-5 5 5M7 7l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="transaction-info">
                  <span class="transaction-label">Ingresos</span>
                  <span class="transaction-amount">{{ formatCurrency(stats.current_month_income || 0) }}</span>
                </div>
              </div>
              <div class="transaction-item expense">
                <div class="transaction-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M17 7l-5 5-5-5M17 17l-5-5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="transaction-info">
                  <span class="transaction-label">Gastos</span>
                  <span class="transaction-amount">{{ formatCurrency(stats.current_month_expenses || 0) }}</span>
                </div>
              </div>
              <div class="transactions-total">
                <span class="total-label">Total de Transacciones</span>
                <span class="total-count">{{ stats.current_month_transactions || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Distribution -->
        <div class="metric-card">
          <div class="metric-card-header">
            <div class="metric-icon-container bg-gradient-to-br from-purple-500 to-pink-600">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="7" width="18" height="10" rx="2" stroke="white" stroke-width="2"/>
                <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" stroke="white" stroke-width="2"/>
              </svg>
            </div>            <div class="metric-details">
              <h3 class="metric-title">Distribución de Cuentas</h3>
              <p class="metric-subtitle">Por estado</p>
            </div>
            <button class="show-more-btn" @click="router.push('/accounts')">Ver Cuentas</button>
          </div>
          <div class="donut-chart-container">
            <div class="donut-chart">
              <div class="donut-center">
                <span class="donut-percentage">{{ getAccountsActivePercentage() }}%</span>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color" style="background: #10b981"></div>
                <span class="legend-label">Cuentas Activas</span>
                <span class="legend-percentage">{{ accountStats.active_accounts || 0 }}</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #f87171"></div>
                <span class="legend-label">Cuentas Inactivas</span>
                <span class="legend-percentage">{{ (accountStats.total_accounts || 0) - (accountStats.active_accounts || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Dashboard Content -->
      <div class="dashboard-content mt-10">
        <!-- Accounts Overview -->
        <div class="accounts-overview">
          <h2 class="section-title">Resumen de Cuentas</h2>
          <div class="accounts-grid">
            <div v-for="account in topAccounts" :key="account.id" class="account-summary-card" @click="router.push('/accounts')">
              <div class="account-icon" :style="`background: ${account.color}`">
                <i :class="account.icon"></i>
              </div>
              <div class="account-info">
                <h4 class="account-name">{{ account.name }}</h4>
                <p class="account-type">{{ getAccountTypeLabel(account.type) }}</p>
                <p class="account-balance">{{ account.formatted_current_balance }}</p>
              </div>
              <div class="account-trend" :class="getTrendClass(account)">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M7 17l5-5 5 5M7 7l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>        </div>
        
        <!-- Budgets Overview -->
        <div class="budgets-overview mt-8">
          <h2 class="section-title">Presupuestos Activos</h2>
          <div class="budgets-grid">
            <div v-for="budget in budgets.filter(b => b.is_active).slice(0, 4)" :key="budget.id" class="budget-summary-card" @click="router.push('/budgets')">
              <div class="budget-header">
                <div class="budget-icon" :style="`background: ${budget.category?.color || '#6366f1'}`">
                  <i class="fas fa-wallet"></i>
                </div>
                <div class="budget-info">
                  <h4 class="budget-name">{{ budget.name }}</h4>
                  <p class="budget-category">{{ budget.category?.name || 'Sin categoría' }}</p>
                </div>
                <div class="budget-period-badge" :style="`background: ${budget.category?.color || '#6366f1'}15; color: ${budget.category?.color || '#6366f1'}`">
                  {{ getPeriodLabel(budget.period) }}
                </div>
              </div>
              <div class="budget-details">
                <div class="budget-amount">
                  <span class="amount-label">Presupuesto:</span>
                  <span class="amount-value">{{ formatCurrency(parseFloat(budget.amount || '0')) }}</span>
                </div>
                <div class="budget-dates">
                  <span class="date-range">{{ formatDateRange(budget.start_date, budget.end_date) }}</span>
                </div>
              </div>
            </div>
              <!-- Add budget card if less than 4 budgets -->
            <div v-if="budgets.filter(b => b.is_active).length < 4" class="add-budget-card" @click="router.push('/budgets')">
              <div class="add-budget-content">
                <div class="add-budget-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <h4 class="add-budget-title">Agregar Presupuesto</h4>
                <p class="add-budget-description">Crea un nuevo presupuesto para controlar tus gastos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
// Corrige la importación de componentes Vue para soportar proyectos Vite + script setup
import DashboardLayout from '../components/DashboardLayout.vue';
import WelcomeBanner from '../components/WelcomeBanner.vue';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountsStore } from '../stores/account/accounts';
import { useTransactionsStore } from '../stores/transaction/transactions';
import { useBudgetsStore } from '../stores/budget/budgets';

const transactionsStore = useTransactionsStore();
const accountsStore = useAccountsStore();
const budgetsStore = useBudgetsStore();
const router = useRouter();
const accounts = computed(() => accountsStore.accounts || []);
const budgets = computed(() => budgetsStore.budgets || []);

// Account stats
const accountStats = computed(() => {
  const activeAccounts = accounts.value.filter(acc => acc.is_active);
  const totalBalance = accounts.value
    .filter(acc => acc.include_in_total)
    .reduce((sum, acc) => sum + parseFloat(acc.current_balance || '0'), 0);
  
  return {
    total_accounts: accounts.value.length,
    active_accounts: activeAccounts.length,
    total_balance: totalBalance,
  };
});

const stats = computed(() => transactionsStore.stats || {
  total_transactions: 0,
  total_income: 0,
  total_expenses: 0,
  net_balance: 0,
  current_month_transactions: 0,
  current_month_income: 0,
  current_month_expenses: 0
});

// Top accounts for pie chart
const topAccounts = computed(() => {
  const sortedAccounts = [...accounts.value]
    .filter(acc => acc.is_active)
    .sort((a, b) => parseFloat(b.current_balance || '0') - parseFloat(a.current_balance || '0'))
    .slice(0, 3);
  
  const totalBalance = sortedAccounts.reduce((sum, acc) => sum + parseFloat(acc.current_balance || '0'), 0);
  
  return sortedAccounts.map((acc, index) => ({
    id: acc.id,
    name: acc.name,
    type: acc.type,
    color: acc.color || ['#60a5fa', '#34d399', '#fbbf24'][index],
    icon: acc.icon || 'fas fa-wallet',
    formatted_current_balance: acc.formatted_current_balance,
    percentage: totalBalance > 0 ? Math.round((parseFloat(acc.current_balance || '0') / totalBalance) * 100) : 0,
    label: acc.name.length > 15 ? acc.name.substring(0, 15) + '...' : acc.name
  }));
});

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getCurrentDateRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return `${startOfMonth.getDate()} ${startOfMonth.toLocaleDateString('es-ES', { month: 'short' })} - ${endOfMonth.getDate()} ${endOfMonth.toLocaleDateString('es-ES', { month: 'short' })}, ${now.getFullYear()}`;
};

const getAccountsActivePercentage = () => {
  if (accountStats.value.total_accounts === 0) return 0;
  return Math.round((accountStats.value.active_accounts / accountStats.value.total_accounts) * 100);
};

const getAccountTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    bank: 'Banco',
    credit_card: 'Tarjeta de crédito',
    cash: 'Efectivo',
    savings: 'Ahorro',
    investment: 'Inversión',
    loan: 'Préstamo',
    other: 'Otro'
  };
  return labels[type] || type;
};

const getTrendClass = (account: any) => {
  const balance = parseFloat(account.current_balance || '0');
  return balance >= 0 ? 'trend-up' : 'trend-down';
};

// Helper functions for budget display
const getPeriodLabel = (period: string) => {
  const labels: Record<string, string> = {
    weekly: 'Semanal',
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    yearly: 'Anual'
  };
  return labels[period] || period;
};

const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = start.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short' 
  });
  const endFormatted = end.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });
  
  return `${startFormatted} - ${endFormatted}`;
};

onMounted(() => {
  if (!accountsStore.accounts.length) {
    accountsStore.fetchAll();
  }
  if (!budgetsStore.budgets.length) {
    budgetsStore.fetchAll();
  }
  transactionsStore.fetchStats();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dashboard-header p {
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

/* Enhanced Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.metric-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.metric-card-main {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.metric-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.metric-icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.metric-details {
  flex: 1;
}

.metric-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.metric-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.show-more-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.show-more-btn:hover {
  background-color: #eff6ff;
}

/* Main metric values */
.metric-values {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.main-value, .comparison-value {
  display: flex;
  flex-direction: column;
}

.current-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.previous-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
  line-height: 1;
}

.period-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  margin-top: 0.25rem;
  letter-spacing: 0.05em;
}

/* Monthly transactions styles */
.monthly-transactions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transactions-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

.transaction-item.income {
  border-color: #86efac;
  background: #f0fdf4;
}

.transaction-item.expense {
  border-color: #fca5a5;
  background: #fef2f2;
}

.transaction-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.transaction-item.income .transaction-icon {
  background: #22c55e;
  color: white;
}

.transaction-item.expense .transaction-icon {
  background: #ef4444;
  color: white;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.transaction-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.transaction-amount {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.transactions-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
}

.total-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
}

.total-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

/* Weekly chart styles */
.weekly-chart {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.chart-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.pie-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #60a5fa 0deg 180deg,
    #f87171 180deg 270deg,
    #fbbf24 270deg 360deg
  );
  position: relative;
}

.pie-chart::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40%;
  height: 40%;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* Donut chart */
.donut-chart-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.donut-chart {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(
    #10b981 0deg 280deg,
    #e5e7eb 280deg 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-chart::after {
  content: '';
  position: absolute;
  width: 60%;
  height: 60%;
  background: white;
  border-radius: 50%;
}

.donut-center {
  position: relative;
  z-index: 2;
  font-weight: 600;
  color: #1f2937;
}

.donut-percentage {
  font-size: 1rem;
  font-weight: 700;
}

/* Chart legends */
.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.legend-percentage {
  color: #6b7280;
  font-weight: 600;
}

/* Dashboard content */
.dashboard-content {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.accounts-overview {
  background: white;
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.account-summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  cursor: pointer;
}

.account-summary-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.account-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.account-info {
  flex: 1;
}

.account-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.account-type {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.account-balance {
  font-size: 1rem;
  font-weight: 700;
  color: #059669;
  margin: 0;
}

.account-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
}

.trend-up {
  background: #dcfce7;
  color: #059669;
}

.trend-down {
  background: #fef2f2;
  color: #dc2626;
}

/* Budgets overview styles */
.budgets-overview {
  background: white;
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.budgets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.budget-summary-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.budget-summary-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.budget-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.budget-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.budget-info {
  flex: 1;
}

.budget-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.budget-category {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.budget-period-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.budget-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.budget-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.amount-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
}

.budget-dates {
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.date-range {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Add budget card */
.add-budget-card {
  border: 2px dashed #d1d5db;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.add-budget-card:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
}

.add-budget-content {
  text-align: center;
}

.add-budget-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #6b7280;
  transition: all 0.2s ease;
}

.add-budget-card:hover .add-budget-icon {
  background: #3b82f6;
  color: white;
}

.add-budget-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.add-budget-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Responsive design */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .weekly-chart, .donut-chart-container {
    flex-direction: column;
    text-align: center;
  }
    .accounts-grid {
    grid-template-columns: 1fr;
  }
  
  .budgets-grid {
    grid-template-columns: 1fr;
  }
  
  .metric-values {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
