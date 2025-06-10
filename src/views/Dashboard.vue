<template>
  <DashboardLayout>
    <div class="dashboard-container">
      <WelcomeBanner />
      <div class="metrics-row">
        <MetricCard
          label="Saldo Total"
          :value="'$12,500.00'"
          :change="2.5"
          iconBg="linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)"
        >
          <template #icon>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9Z" stroke="#fff" stroke-width="2"/><path d="M12 7v5l3 3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </template>
        </MetricCard>
        <MetricCard
          label="Ingresos"
          :value="'$4,200.00'"
          :change="5.1"
          iconBg="linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)"
        >
          <template #icon>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 3v18m0 0-6-6m6 6 6-6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </template>
        </MetricCard>
        <MetricCard
          label="Gastos"
          :value="'$2,800.00'"
          :change="-1.8"
          iconBg="linear-gradient(135deg, #f87171 0%, #fbbf24 100%)"
        >
          <template #icon>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 21V3m0 0 6 6m-6-6-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </template>
        </MetricCard>
        <MetricCard
          label="Cuentas"
          :value="'5'"
          iconBg="linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)"
        >
          <template #icon>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="#fff" stroke-width="2"/><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" stroke="#fff" stroke-width="2"/></svg>
          </template>
        </MetricCard>
      </div>
      <div class="widgets-row">
        <!-- Aquí irá el gráfico principal y otros widgets -->
        <div class="widget-placeholder">[Gráfico de ingresos/gastos]</div>
        <div class="widget-placeholder">[Widget de perfil/resumen]</div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../components/DashboardLayout.vue';
import WelcomeBanner from '../components/WelcomeBanner.vue';
import MetricCard from '../components/MetricCard.vue';
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 2rem 1.5rem;
}
.metrics-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}
.metrics-row > * {
  flex: 1 1 220px;
  min-width: 200px;
}
.widgets-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.widget-placeholder {
  flex: 1 1 350px;
  min-height: 260px;
  background: var(--card-bg, #fff);
  border-radius: 1.25rem;
  box-shadow: 0 2px 8px 0 rgba(60,60,60,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 1.2rem;
  font-style: italic;
}
@media (max-width: 900px) {
  .metrics-row, .widgets-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
