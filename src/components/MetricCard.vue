<template>
  <div
    class="flex items-center gap-4 rounded-xl shadow-md px-6 py-5 min-w-[180px] min-h-[90px] transition hover:shadow-lg bg-white dark:bg-[var(--color-surface)]"
  >
    <div
      class="flex items-center justify-center rounded-lg text-xl w-12 h-12 shrink-0"
      :class="iconBgClass"
    >
      <slot name="icon" />
    </div>
    <div class="flex-1">
      <div class="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{{ label }}</div>
      <div class="text-xl font-bold text-gray-800">{{ value }}</div>
      <div v-if="change !== undefined" :class="changeClass">
        <span>{{ change >= 0 ? '+' : '' }}{{ change }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string | number
  change?: number
  iconBg?: string
}>()

// Paleta profesional y armónica para cards
const palette: Record<string, string> = {
  saldo: 'bg-gradient-to-br from-blue-600 to-indigo-500 text-white',
  ingresos: 'bg-gradient-to-br from-cyan-500 to-teal-400 text-white',
  gastos: 'bg-gradient-to-br from-pink-500 to-orange-400 text-white',
  cuentas: 'bg-gradient-to-br from-purple-500 to-pink-400 text-white',
  default: 'bg-gradient-to-br from-slate-400 to-slate-500 text-white',
};

// Detecta el tipo de card por label (puedes ajustar esto según tus props reales)
function getPalette(label: string) {
  if (/saldo/i.test(label)) return palette.saldo;
  if (/ingreso/i.test(label)) return palette.ingresos;
  if (/gasto/i.test(label)) return palette.gastos;
  if (/cuenta/i.test(label)) return palette.cuentas;
  return palette.default;
}

const iconBgClass = getPalette(props.label);
const changeClass = props.change !== undefined
  ? props.change >= 0
    ? 'text-green-600 text-sm mt-0.5'
    : 'text-red-500 text-sm mt-0.5'
  : '';
</script>
