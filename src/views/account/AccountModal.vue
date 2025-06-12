<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h3 class="font-bold text-lg mb-2">{{ isEdit ? 'Editar cuenta' : 'Nueva cuenta' }}</h3>
        <form @submit.prevent="onSubmit">
          <div class="mb-2">
            <label class="block mb-1">Nombre</label>
            <input v-model="form.name" required class="input input-bordered w-full" maxlength="255" />
          </div>
          <div class="mb-2">
            <label class="block mb-1">Tipo</label>
            <select v-model="form.type" required class="select select-bordered w-full">
              <option v-for="type in accountTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Moneda</label>
            <select v-model="form.currency" required class="select select-bordered w-full">
              <option v-for="currency in accountCurrencies" :key="currency" :value="currency">{{ currency }}</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Saldo inicial</label>
            <input v-model="form.initial_balance" required type="number" step="0.01" class="input input-bordered w-full" />
          </div>
          <div class="mb-2">
            <label class="block mb-1">Color</label>
            <input v-model="form.color" type="color" class="input input-bordered w-16" />
          </div>
          <div class="mb-2">
            <label class="block mb-1">Icono</label>
            <input v-model="form.icon" class="input input-bordered w-full" maxlength="50" />
          </div>
          <div class="mb-2">
            <label class="block mb-1">Descripción</label>
            <textarea v-model="form.description" class="textarea textarea-bordered w-full" maxlength="1000"></textarea>
          </div>
          <div class="mb-2 flex gap-4">
            <label class="flex items-center gap-1">
              <input type="checkbox" v-model="form.is_active" /> Activa
            </label>
            <label class="flex items-center gap-1">
              <input type="checkbox" v-model="form.include_in_total" /> Incluir en total
            </label>
          </div>
          <div v-if="error" class="alert alert-error mb-2">{{ error }}</div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="btn" @click="$emit('close')">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">{{ isEdit ? 'Guardar' : 'Crear' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAccountsStore } from '../../stores/account/accounts';
import type { Account, AccountPayload, AccountType, AccountCurrency } from '../../types/account/account';

const props = defineProps<{ account?: Account | null }>();
const emit = defineEmits(['close', 'saved']);

const store = useAccountsStore();
const { create, update, loading, error } = store;

const isEdit = computed(() => !!props.account);
const form = ref<AccountPayload>({
  name: '',
  type: 'bank',
  currency: 'USD',
  initial_balance: '0.00',
  color: '#000000',
  icon: '',
  description: '',
  is_active: true,
  include_in_total: true
});

const accountTypes = Object.freeze([
  'bank', 'credit_card', 'cash', 'savings', 'investment', 'loan', 'other'
]) as AccountType[];
const accountCurrencies = Object.freeze([
  'USD', 'EUR', 'MXN', 'GBP', 'CAD', 'COP', 'ARS', 'BRL', 'CLP', 'PEN', 'UYU', 'VEF', 'PYG', 'CRC', 'NIO', 'HNL', 'GTQ', 'SVC', 'XAF', 'XOF', 'XPF'
]) as AccountCurrency[];

watch(() => props.account, (acc) => {
  if (acc) {
    form.value = {
      name: acc.name,
      type: acc.type,
      currency: acc.currency,
      initial_balance: acc.initial_balance,
      color: acc.color || '#000000',
      icon: acc.icon || '',
      description: acc.description || '',
      is_active: acc.is_active,
      include_in_total: acc.include_in_total
    };
  } else {
    form.value = {
      name: '',
      type: 'bank',
      currency: 'USD',
      initial_balance: '0.00',
      color: '#000000',
      icon: '',
      description: '',
      is_active: true,
      include_in_total: true
    };
  }
}, { immediate: true });

async function onSubmit() {
  try {
    if (isEdit.value && props.account) {
      await update(props.account.id, form.value);
    } else {
      await create(form.value);
    }
    emit('saved');
  } catch (e) {
    // error ya manejado por el store
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 50;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-wrapper {
  width: 100%;
  max-width: 420px;
}
.modal-container {
  background: #fff;
  border-radius: 8px;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
}
</style>
