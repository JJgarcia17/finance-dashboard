<template>
  <DashboardLayout>
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Transacciones</h1>
          <p class="text-gray-600">Gestiona todas tus transacciones financieras</p>
        </div>
        <button 
          @click="showCreate = true" 
          class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 ease-in-out flex items-center gap-3 font-semibold hover:transform hover:scale-105" 
          data-testid="new-transaction-btn"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Nueva Transacción
        </button>
      </div>

      <!-- Métricas Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Total Transacciones</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats?.total_transactions ?? '-' }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Ingresos Totales</p>
              <p class="text-3xl font-bold text-green-600">{{ stats?.total_income !== undefined ? stats.total_income.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : '-' }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <path d="M7 11l5-5m0 0l5 5m-5-5v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Gastos Totales</p>
              <p class="text-3xl font-bold text-red-600">{{ stats?.total_expenses !== undefined ? stats.total_expenses.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : '-' }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <path d="M17 13l-5 5m0 0l-5-5m5 5V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div class="space-y-2">
            <label for="trx-type-filter" class="block text-sm font-semibold text-gray-700">Tipo</label>
            <select 
              id="trx-type-filter" 
              v-model="filters.type" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option :value="undefined">Todos los tipos</option>
              <option value="income">💰 Ingreso</option>
              <option value="expense">💸 Gasto</option>
              <option value="transfer">🔄 Transferencia</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="trx-account-filter" class="block text-sm font-semibold text-gray-700">Cuenta</label>
            <select 
              id="trx-account-filter" 
              v-model="filters.account_id" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option :value="undefined">Todas las cuentas</option>
              <option v-for="acc in accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="trx-category-filter" class="block text-sm font-semibold text-gray-700">Categoría</label>
            <select 
              id="trx-category-filter" 
              v-model="filters.category_id" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option :value="undefined">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="trx-date-start" class="block text-sm font-semibold text-gray-700">Fecha inicio</label>
            <input 
              id="trx-date-start" 
              v-model="filters.min_date" 
              type="date" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <div class="space-y-2">
            <label for="trx-date-end" class="block text-sm font-semibold text-gray-700">Fecha fin</label>
            <input 
              id="trx-date-end" 
              v-model="filters.max_date" 
              type="date" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div v-if="filterError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center animate-pulse">
        {{ filterError }}
      </div>

      <div v-if="statsError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center animate-pulse">
        {{ statsError }}
      </div>

      <!-- Transactions List -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cuenta</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Categoría</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Monto</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="trx in transactions" :key="trx.id" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div 
                      :class="[
                        'w-10 h-10 rounded-xl flex items-center justify-center shadow-sm',
                        trx.type === 'income' ? 'bg-green-100 text-green-600' : 
                        trx.type === 'expense' ? 'bg-red-100 text-red-600' : 
                        'bg-blue-100 text-blue-600'
                      ]"
                    >
                      <svg v-if="trx.type === 'income'" class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <path d="M7 11l5-5m0 0l5 5m-5-5v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else-if="trx.type === 'expense'" class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <path d="M17 13l-5 5m0 0l-5-5m5 5V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <span 
                      :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                        trx.type === 'income' ? 'bg-green-100 text-green-800' : 
                        trx.type === 'expense' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ typeLabels[trx.type] }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ trx.transaction_date }}</div>
                  <div v-if="trx.created_at" class="text-xs text-gray-500">{{ trx.created_at.split(' ')[1] }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ trx.account?.name || '-' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ trx.description || '-' }}</div>
                  <div v-if="trx.reference_number" class="text-xs text-gray-500 font-mono">{{ trx.reference_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ trx.category?.name || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div 
                    :class="[
                      'text-lg font-bold',
                      trx.type === 'income' ? 'text-green-600' : 
                      trx.type === 'expense' ? 'text-red-600' : 
                      'text-blue-600'
                    ]"
                  >
                    {{ trx.type === 'expense' ? '-' : '+' }}{{ trx.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="edit(trx)" 
                      class="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-semibold"
                      title="Editar"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Editar
                    </button>
                    
                    <button 
                      v-if="trx.can_delete" 
                      @click="remove(trx.id)" 
                      class="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-semibold"
                      title="Eliminar"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr v-if="!transactions.length && !loading">
                <td colspan="7" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center">
                    <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay transacciones</h3>
                    <p class="text-gray-600 mb-6">Crea tu primera transacción para empezar a rastrear tus finanzas</p>
                    <button 
                      @click="showCreate = true" 
                      class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 ease-in-out font-semibold"
                    >
                      Crear primera transacción
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="px-6 py-16 text-center">
          <div class="inline-flex items-center gap-3 text-blue-600">
            <svg class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"/>
            </svg>
            <span class="text-lg font-semibold">Cargando transacciones...</span>
          </div>
        </div>
      </div>

      <!-- Modal crear/editar -->
      <div v-if="showCreate || editing" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative animate-modal max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <button 
              @click="closeModal" 
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200" 
              aria-label="Cerrar modal"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            
            <div class="text-center mb-6">
              <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900 mb-1">
                {{ editing ? 'Editar Transacción' : 'Nueva Transacción' }}
              </h2>
              <p class="text-sm text-gray-600">
                {{ editing ? 'Actualiza la información' : 'Registra una nueva transacción financiera' }}
              </p>
            </div>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Monto y Tipo -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="trx-amount" class="block text-sm font-semibold text-gray-700">Monto</label>
                  <input 
                    id="trx-amount" 
                    v-model="form.amount" 
                    type="number" 
                    step="0.01" 
                    min="0.01" 
                    placeholder="0.00" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
                
                <div class="space-y-2">
                  <label for="trx-type" class="block text-sm font-semibold text-gray-700">Tipo</label>
                  <select 
                    id="trx-type" 
                    v-model="form.type" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                  >
                    <option value="">Selecciona tipo</option>
                    <option value="income">💰 Ingreso</option>
                    <option value="expense">💸 Gasto</option>
                    <option value="transfer">🔄 Transferencia</option>
                  </select>
                </div>
              </div>
              
              <!-- Cuenta y Categoría -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="trx-account" class="block text-sm font-semibold text-gray-700">Cuenta</label>
                  <select 
                    id="trx-account" 
                    v-model="form.account_id" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                  >
                    <option value="">Selecciona cuenta</option>
                    <option v-for="acc in accounts" :key="acc.id" :value="String(acc.id)">{{ acc.name }}</option>
                  </select>
                </div>
                
                <div class="space-y-2">
                  <label for="trx-category" class="block text-sm font-semibold text-gray-700">Categoría</label>
                  <select 
                    id="trx-category" 
                    v-model="form.category_id" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                  >
                    <option value="">Selecciona categoría</option>
                    <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">{{ cat.name }}</option>
                  </select>
                </div>
              </div>
              
              <!-- Fecha y Descripción -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="trx-date" class="block text-sm font-semibold text-gray-700">Fecha</label>
                  <input 
                    id="trx-date" 
                    v-model="form.transaction_date" 
                    type="date" 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
                
                <div class="space-y-2">
                  <label for="trx-description" class="block text-sm font-semibold text-gray-700">Descripción</label>
                  <input 
                    id="trx-description" 
                    v-model="form.description" 
                    type="text" 
                    maxlength="255" 
                    placeholder="Ej: Compra en supermercado..." 
                    required 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
              </div>
              
              <!-- Referencia -->
              <div class="space-y-2">
                <label for="trx-reference" class="block text-sm font-semibold text-gray-700">
                  Número de referencia 
                  <span class="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input 
                  id="trx-reference" 
                  v-model="form.reference_number" 
                  type="text" 
                  maxlength="100" 
                  placeholder="Ej: REF-001, TXN-12345..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                />
              </div>
              
              <!-- Notas -->
              <div class="space-y-2">
                <label for="trx-notes" class="block text-sm font-semibold text-gray-700">
                  Notas adicionales 
                  <span class="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea 
                  id="trx-notes" 
                  v-model="form.notes" 
                  maxlength="1000" 
                  rows="3"
                  placeholder="Información adicional sobre la transacción..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm resize-none"
                ></textarea>
              </div>
              
              <!-- Botones de acción -->
              <div class="flex gap-3 pt-6">
                <button 
                  type="button"
                  @click="closeModal" 
                  class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  :disabled="submitting" 
                  class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"/>
                  </svg>
                  {{ editing ? 'Actualizar' : 'Crear' }}
                </button>
              </div>
              
              <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm animate-pulse mt-4" data-testid="form-error">
                {{ formError }}
              </div>
            </form>          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :is-open="confirmationModal.isOpen.value"
      :loading="confirmationModal.loading.value"
      :config="confirmationModal.modalConfig"
      @confirm="confirmationModal.confirm"
      @cancel="confirmationModal.cancel"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed, onMounted, watch, reactive } from 'vue';
import { useTransactionsStore } from '../../stores/transaction/transactions';
import { useAccountsStore } from '../../stores/account/accounts';
import { useCategoriesStore } from '../../stores/category/categories';
import { useToast } from 'vue-toast-notification';
import { useConfirmationModal } from '../../composables/useConfirmationModal';
import type { Transaction, TransactionType, TransactionFilters } from '../../types/transaction/transaction';

const DashboardLayout = defineAsyncComponent(() => import('../../components/DashboardLayout.vue'));
const ConfirmationModal = defineAsyncComponent(() => import('../../components/ConfirmationModal.vue'));

// Confirmation modal composable
const confirmationModal = useConfirmationModal();

const store = useTransactionsStore();
const accountsStore = useAccountsStore();
const categoriesStore = useCategoriesStore();
const transactions = computed(() => Array.isArray(store.transactions) ? store.transactions : []);
const accounts = computed(() => Array.isArray(accountsStore.accounts) ? accountsStore.accounts : []);
const categories = computed(() => Array.isArray(categoriesStore.categories) ? categoriesStore.categories : []);
const loading = computed(() => store.loading);
const stats = computed(() => store.stats || {
  total_transactions: 0,
  total_income: 0,
  total_expenses: 0,
  net_balance: 0,
  current_month_transactions: 0,
  current_month_income: 0,
  current_month_expenses: 0
});
// Filtros reactivos compatibles con los tipos
const filters = reactive<TransactionFilters>({
  type: undefined,
  account_id: undefined,
  category_id: undefined,
  min_date: undefined,
  max_date: undefined
});

const typeLabels: Record<string, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  transfer: 'Transferencia',
};

const toast = useToast();
const showCreate = ref(false);
const editing = ref<Transaction | null>(null);
const submitting = ref(false);
const filterError = ref<string | null>(null);
const formError = ref<string | null>(null);
const statsError = ref('');

const form = reactive({
  account_id: '',
  category_id: '',
  type: '',
  amount: '',
  description: '',
  transaction_date: '',
  reference_number: '',
  notes: '',
});

// Limpia los filtros antes de enviarlos a la API para evitar enviar undefined o vacíos
function cleanFilters(obj: typeof filters) {
  const out: Record<string, any> = {};
  if (obj.type) out.type = obj.type;
  if (obj.account_id !== undefined) out.account_id = obj.account_id;
  if (obj.category_id !== undefined) out.category_id = obj.category_id;
  if (obj.min_date) out.start_date = obj.min_date;
  if (obj.max_date) out.end_date = obj.max_date;
  return out;
}

function fetchAll() {
  store.fetchAll(cleanFilters(filters));
}

// Función para actualizar tanto transacciones como estadísticas
async function refreshData() {
  fetchAll();
  await fetchStatsWithError(false);
}

async function fetchStatsWithError(showToastOnError = true) {
  try {
    await store.fetchStats();
    statsError.value = '';
  } catch (e: any) {
    statsError.value = e?.response?.data?.message || e?.message || 'Error al cargar métricas';
    if (showToastOnError) {
      toast.error(statsError.value);
    }
  }
}

onMounted(() => {
  if (!accountsStore.accounts.length) {
    accountsStore.fetchAll();
  }
  if (!categoriesStore.categories.length) {
    categoriesStore.fetchAll();
  }
  fetchAll();
  if (!store.stats) {
    fetchStatsWithError();
  }
});

watch(
  () => [filters.type, filters.account_id, filters.category_id, filters.min_date, filters.max_date],
  () => {
    fetchAll();
  }
);

function edit(trx: Transaction) {
  // Always fetch the latest transaction from the backend to get full account/category info
  const ensureLoaded = async () => {
    if (!accounts.value.length) await accountsStore.fetchAll();
    if (!categories.value.length) await categoriesStore.fetchAll();
    // Fetch the full transaction (with account/category objects)
    const fullTrx = await store.fetchOne(trx.id);
    editing.value = fullTrx;
    Object.assign(form, {
      account_id: fullTrx.account?.id !== undefined && fullTrx.account?.id !== null ? String(fullTrx.account.id) : '',
      category_id: fullTrx.category?.id !== undefined && fullTrx.category?.id !== null ? String(fullTrx.category.id) : '',
      type: fullTrx.type,
      amount: fullTrx.amount,
      description: fullTrx.description,
      transaction_date: fullTrx.transaction_date,
      reference_number: fullTrx.reference_number || '',
      notes: fullTrx.notes || '',
    });
    showCreate.value = false;
  };
  ensureLoaded();
}

function closeModal() {
  showCreate.value = false;
  editing.value = null;
  Object.assign(form, {
    account_id: '',
    category_id: '',
    type: '',
    amount: '',
    description: '',
    transaction_date: '',
    reference_number: '',
    notes: '',
  });
  submitting.value = false;
  formError.value = null;
}

async function submitForm() {
  formError.value = null;
  // Validaciones principales
  if (!form.account_id) {
    formError.value = 'Selecciona una cuenta';
    toast.error(formError.value);
    return;
  }
  if (!form.category_id) {
    formError.value = 'Selecciona una categoría';
    toast.error(formError.value);
    return;
  }
  if (!form.type) {
    formError.value = 'Selecciona un tipo de transacción';
    toast.error(formError.value);
    return;
  }
  if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) < 0.01 || Number(form.amount) > 999999999.99) {
    formError.value = 'El monto debe ser un número mayor a 0 y menor a 1,000,000,000';
    toast.error(formError.value);
    return;
  }
  if (!form.description || form.description.length < 2) {
    formError.value = 'La descripción es obligatoria y debe tener al menos 2 caracteres.';
    toast.error(formError.value);
    return;
  }
  if (!form.transaction_date) {
    formError.value = 'Selecciona una fecha válida';
    toast.error(formError.value);
    return;
  }
  if (form.reference_number && form.reference_number.length > 100) {
    formError.value = 'La referencia no puede tener más de 100 caracteres';
    toast.error(formError.value);
    return;
  }
  if (form.notes && form.notes.length > 1000) {
    formError.value = 'Las notas no pueden tener más de 1000 caracteres';
    toast.error(formError.value);
    return;
  }
  submitting.value = true;
  try {
    const payload = {
      account_id: Number(form.account_id),
      category_id: Number(form.category_id),
      type: form.type as TransactionType,
      amount: Number(form.amount),
      description: form.description,
      transaction_date: form.transaction_date,
      reference_number: form.reference_number || undefined,
      notes: form.notes || undefined,
    };
    if (editing.value) {
      await store.update(editing.value.id, payload);
      toast.success('Transacción actualizada');
    } else {
      await store.create(payload);
      toast.success('Transacción creada');    }
    closeModal();
    refreshData(); // Actualizar transacciones y estadísticas
  } catch (e: any) {
    formError.value = e?.response?.data?.message || e.message || 'Error al guardar';
    toast.error(formError.value || 'Error desconocido');
  } finally {
    submitting.value = false;
  }
}

async function remove(id: number) {
  // Find the transaction to get its details for the confirmation modal
  const transaction = transactions.value.find(t => t.id === id);
  if (!transaction) return;

  // Get account and category names for display
  const account = accounts.value.find(a => a.id === transaction.account?.id);
  const category = categories.value.find(c => c.id === transaction.category?.id);

  const itemName = transaction.description || 'Sin descripción';
  const itemDescription = `${account?.name || 'Cuenta desconocida'} • ${category?.name || 'Sin categoría'}`;

  const confirmed = await confirmationModal.confirmDelete(itemName, itemDescription);

  if (!confirmed) return;

  try {
    await store.remove(id);
    toast.success('Transacción eliminada');
    refreshData(); // Actualizar transacciones y estadísticas
  } catch (e: any) {
    toast.error(e?.message || 'Error al eliminar');
  }
}
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

.animate-modal {
  animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes modalSlideIn {
  0% { 
    transform: scale(0.9) translateY(-20px); 
    opacity: 0; 
  }
  100% { 
    transform: scale(1) translateY(0); 
    opacity: 1; 
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>
