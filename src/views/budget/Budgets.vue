<template>
  <DashboardLayout>
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header">
        <div>
          <h1 class="text-3xl font-bold text-gray-900" data-testid="budgets-title">Presupuestos</h1>
          <p class="text-gray-600 mt-1">Gestiona y supervisa tus presupuestos financieros</p>
        </div>
        <button 
          @click="showCreate = true" 
          class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 font-medium" 
          data-testid="new-budget-btn"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Nuevo Presupuesto
        </button>
      </div>      <!-- Filters Section -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="space-y-2">
            <label for="budget-category-filter" class="block text-sm font-medium text-gray-700">Categoría</label>
            <select 
              id="budget-category-filter" 
              v-model="filters.category_id" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option :value="undefined">Todas las categorías</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="budget-period-filter" class="block text-sm font-medium text-gray-700">Período</label>
            <select 
              id="budget-period-filter" 
              v-model="filters.period" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option :value="undefined">Todos los períodos</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="budget-status-filter" class="block text-sm font-medium text-gray-700">Estado</label>
            <select 
              id="budget-status-filter" 
              v-model="filters.is_active" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option :value="undefined">Todos los estados</option>
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="budget-date-start" class="block text-sm font-medium text-gray-700">Fecha inicio</label>
            <input 
              id="budget-date-start" 
              v-model="filters.start_date" 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            />
          </div>

          <div class="space-y-2">
            <label for="budget-date-end" class="block text-sm font-medium text-gray-700">Fecha fin</label>
            <input 
              id="budget-date-end" 
              v-model="filters.end_date" 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            />
          </div>
        </div>
      </div>      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">Total Presupuestos</p>
              <p class="text-2xl font-bold text-blue-900 mt-1">{{ budgets.length }}</p>
            </div>
            <div class="bg-blue-500 rounded-xl p-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">Presupuestos Activos</p>
              <p class="text-2xl font-bold text-green-900 mt-1">{{ activeBudgets.length }}</p>
            </div>
            <div class="bg-green-500 rounded-xl p-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">Monto Total</p>
              <p class="text-2xl font-bold text-purple-900 mt-1">{{ totalAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }}</p>
            </div>
            <div class="bg-purple-500 rounded-xl p-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-indigo-600 text-sm font-medium">Monto Activo</p>
              <p class="text-2xl font-bold text-indigo-900 mt-1">{{ activeAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }}</p>
            </div>
            <div class="bg-indigo-500 rounded-xl p-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>      <div v-if="filterError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center animate-pulse">{{ filterError }}</div>

      <!-- Budget Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="budget in budgets" 
          :key="budget.id" 
          :class="[
            'bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-200 hover:shadow-xl',
            budget.is_active ? 'hover:border-blue-300' : 'opacity-75 hover:border-gray-300'
          ]" 
          data-testid="budget-card"
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                :style="`background: linear-gradient(135deg, ${budget.category.color}, ${budget.category.color}cc)`"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 text-lg truncate">{{ budget.name }}</h3>
                <p class="text-sm text-gray-500 truncate">{{ budget.category.name }}</p>
              </div>
            </div>
            <span 
              class="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
              :style="`background: ${budget.category.color}20; color: ${budget.category.color}`"
            >
              {{ periodLabels[budget.period] }}
            </span>
          </div>
          
          <!-- Amount Display -->
          <div class="mb-4 p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center justify-between">
              <span class="text-gray-600 font-medium">Presupuesto:</span>
              <span class="text-2xl font-bold text-gray-900">
                {{ parseFloat(budget.amount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }}
              </span>
            </div>
          </div>

          <!-- Date Range -->
          <div class="mb-4 flex items-center justify-between text-sm text-gray-500">
            <span class="bg-white px-3 py-1 rounded-lg border">{{ budget.start_date }}</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
            <span class="bg-white px-3 py-1 rounded-lg border">{{ budget.end_date }}</span>
          </div>

          <!-- Status Badge -->
          <div class="mb-4">
            <span 
              v-if="budget.is_active" 
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Activo
            </span>
            <span 
              v-else 
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              Inactivo
            </span>
          </div>

          <!-- Description -->
          <div v-if="budget.description" class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-800">{{ budget.description }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 pt-4 border-t border-gray-100">
            <button 
              @click="edit(budget)" 
              class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2" 
              title="Editar" 
              data-testid="edit-budget-btn"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar
            </button>
            
            <button 
              v-if="budget.deleted_at" 
              @click="restore(budget.id)" 
              class="bg-green-50 hover:bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors" 
              title="Restaurar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
              </svg>
            </button>
            <button 
              v-else 
              @click="remove(budget.id)" 
              class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors" 
              title="Eliminar" 
              data-testid="delete-budget-btn"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
            
            <button 
              @click="toggleStatus(budget.id)" 
              class="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors" 
              :title="budget.is_active ? 'Desactivar' : 'Activar'" 
              data-testid="toggle-budget-btn"
            >
              <svg v-if="budget.is_active" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="!budgets.length && !loading" class="col-span-full">
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay presupuestos</h3>
            <p class="mt-1 text-sm text-gray-500">Comienza creando tu primer presupuesto.</p>
            <div class="mt-6">
              <button 
                @click="showCreate = true" 
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
                </svg>
                Nuevo presupuesto
              </button>
            </div>
          </div>
        </div>
      </div>      
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>      <!-- Create/Edit Modal -->
      <div 
        v-if="showCreate || editing" 
        class="fixed inset-0 flex items-center justify-center z-50" 
        :class="confirmationModal.isOpen.value ? 'bg-black/20' : 'bg-black/50'"
        data-testid="budget-modal"
      >
        <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-modal max-h-[90vh] overflow-y-auto">
          <button 
            @click="closeModal" 
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" 
            aria-label="Cerrar modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          
          <div class="text-center mb-6">
            <div class="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900" data-testid="modal-title">
              {{ editing ? 'Editar Presupuesto' : 'Crear Nuevo Presupuesto' }}
            </h2>
          </div>
          
          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="space-y-2">
              <label for="budget-name" class="block text-sm font-medium text-gray-700">Nombre del presupuesto</label>
              <input 
                id="budget-name" 
                v-model="form.name" 
                type="text" 
                placeholder="Ej: Presupuesto mensual comida" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              />
            </div>

            <div class="space-y-2">
              <label for="budget-category" class="block text-sm font-medium text-gray-700">Categoría</label>
              <select 
                id="budget-category" 
                v-model="form.category_id" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Selecciona una categoría</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>

            <div class="space-y-2">
              <label for="budget-amount" class="block text-sm font-medium text-gray-700">Monto del presupuesto</label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">$</span>
                <input 
                  id="budget-amount" 
                  v-model="form.amount" 
                  type="number" 
                  min="0.01" 
                  step="0.01" 
                  placeholder="0.00" 
                  required 
                  class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="budget-period" class="block text-sm font-medium text-gray-700">Período</label>
              <select 
                id="budget-period" 
                v-model="form.period" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Selecciona un período</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="budget-start-date" class="block text-sm font-medium text-gray-700">Fecha de inicio</label>
                <input 
                  id="budget-start-date" 
                  v-model="form.start_date" 
                  type="date" 
                  required 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                />
              </div>
              
              <div class="space-y-2">
                <label for="budget-end-date" class="block text-sm font-medium text-gray-700">Fecha de fin</label>
                <input 
                  id="budget-end-date" 
                  v-model="form.end_date" 
                  type="date" 
                  required 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="budget-description" class="block text-sm font-medium text-gray-700">Descripción (opcional)</label>
              <textarea 
                id="budget-description" 
                v-model="form.description" 
                rows="3" 
                placeholder="Descripción del presupuesto..." 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              ></textarea>
            </div>

            <div class="flex items-center">
              <input 
                v-model="form.is_active" 
                type="checkbox" 
                id="budget-active"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label for="budget-active" class="ml-2 block text-sm text-gray-700">Presupuesto activo</label>
            </div>

            <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" data-testid="form-error">
              {{ formError }}
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                :disabled="submitting" 
                class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" 
                data-testid="save-budget-btn"
              >
                <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ editing ? 'Actualizar Presupuesto' : 'Crear Presupuesto' }}
              </button>
            </div>
          </form>        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :is-open="confirmationModal.isOpen.value"
      :type="confirmationModal.modalConfig.type"
      :title="confirmationModal.modalConfig.title"
      :message="confirmationModal.modalConfig.message"
      :confirm-text="confirmationModal.modalConfig.confirmText"
      :cancel-text="confirmationModal.modalConfig.cancelText"
      :item-name="confirmationModal.modalConfig.itemName"
      :item-description="confirmationModal.modalConfig.itemDescription"
      :item-color="confirmationModal.modalConfig.itemColor"
      :show-warning="confirmationModal.modalConfig.showWarning"
      :warning-message="confirmationModal.modalConfig.warningMessage"
      :loading="confirmationModal.loading.value"
      @confirm="confirmationModal.confirm"
      @cancel="confirmationModal.cancel"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useBudgetsStore } from '../../stores/budget/budgets';
import { useCategoriesStore } from '../../stores/category/categories';
import { useToast } from 'vue-toast-notification';
import { useConfirmationModal } from '../../composables/useConfirmationModal';
import type { Budget, BudgetPeriod, BudgetFilters } from '../../types/budget/budget';

const DashboardLayout = defineAsyncComponent(() => import('../../components/DashboardLayout.vue'));
const ConfirmationModal = defineAsyncComponent(() => import('../../components/ConfirmationModal.vue'));

const store = useBudgetsStore();
const categoriesStore = useCategoriesStore();
const toast = useToast();
const confirmationModal = useConfirmationModal();

// Data
const budgets = computed(() => Array.isArray(store.budgets) ? store.budgets : []);
const activeBudgets = computed(() => store.activeBudgets);
const totalAmount = computed(() => store.totalAmount);
const activeAmount = computed(() => store.activeAmount);
const loading = computed(() => store.loading);
const categories = computed(() => categoriesStore.categories);

const filters = reactive<BudgetFilters>({...store.filters});

const showCreate = ref(false);
const editing = ref<Budget | null>(null);
const form = reactive<{
  name: string;
  category_id: number | '';
  amount: string;
  period: BudgetPeriod | '';
  start_date: string;
  end_date: string;
  is_active: boolean;
  description: string;
}>({
  name: '',
  category_id: '',
  amount: '',
  period: '',
  start_date: '',
  end_date: '',
  is_active: true,
  description: '',
});

const submitting = ref(false);
const filterError = ref<string | null>(null);
const formError = ref<string | null>(null);

// Constants
const periodLabels: Record<BudgetPeriod, string> = {
  weekly: 'Semanal',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  yearly: 'Anual',
};

// Watch filters
watch(
  () => [filters.category_id, filters.period, filters.is_active, filters.start_date, filters.end_date],
  () => {
    store.fetchAll(cleanFilters(filters));
  }
);

// Methods
function edit(budget: Budget) {
  editing.value = budget;
  Object.assign(form, {
    name: budget.name,
    category_id: budget.category.id,
    amount: budget.amount,
    period: budget.period,
    start_date: budget.start_date,
    end_date: budget.end_date,
    is_active: budget.is_active,
    description: budget.description || '',
  });
  showCreate.value = false;
}

function closeModal() {
  showCreate.value = false;
  editing.value = null;
  Object.assign(form, {
    name: '',
    category_id: '',
    amount: '',
    period: '',
    start_date: '',
    end_date: '',
    is_active: true,
    description: '',
  });
  submitting.value = false;
  formError.value = null;
}

async function submitForm() {
  formError.value = null;
  
  // Validaciones
  if (!form.name || form.name.trim().length < 2) {
    formError.value = 'El nombre es obligatorio y debe tener al menos 2 caracteres.';
    toast.error(formError.value);
    return;
  }
  
  if (!form.category_id) {
    formError.value = 'Selecciona una categoría';
    toast.error(formError.value);
    return;
  }
  
  if (!form.amount || parseFloat(form.amount) <= 0) {
    formError.value = 'El monto debe ser mayor a 0';
    toast.error(formError.value);
    return;
  }
  
  if (!form.period) {
    formError.value = 'Selecciona un período';
    toast.error(formError.value);
    return;
  }
  
  if (!form.start_date || !form.end_date) {
    formError.value = 'Las fechas de inicio y fin son obligatorias';
    toast.error(formError.value);
    return;
  }
  
  if (new Date(form.end_date) <= new Date(form.start_date)) {
    formError.value = 'La fecha de fin debe ser posterior a la fecha de inicio';
    toast.error(formError.value);
    return;
  }

  submitting.value = true;
  
  try {
    const payload = {
      name: form.name,
      category_id: form.category_id as number,
      amount: form.amount,
      period: form.period as BudgetPeriod,
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.is_active,
      description: form.description || undefined,
    };

    if (editing.value) {
      await store.update(editing.value.id, payload);
      toast.success('Presupuesto actualizado');
    } else {
      await store.create(payload);
      toast.success('Presupuesto creado');
    }
    
    closeModal();
    fetchBudgets();
  } catch (e: any) {
    toast.error(e?.message || 'Error al guardar');
  } finally {
    submitting.value = false;
  }
}

async function remove(id: number) {
  const budget = budgets.value.find(b => b.id === id);
  if (!budget) return;

  const confirmed = await confirmationModal.confirmDelete(
    budget.name,
    `${budget.category.name} - ${budget.amount}`,
    budget.category.color
  );

  if (confirmed) {
    confirmationModal.setLoading(true);
    try {
      await store.remove(id);
      toast.success('Presupuesto eliminado');
      fetchBudgets();
    } catch (e: any) {
      toast.error(e?.message || 'Error al eliminar');
    } finally {
      confirmationModal.setLoading(false);
    }
  }
}

async function restore(id: number) {
  const budget = budgets.value.find(b => b.id === id);
  if (!budget) return;

  const confirmed = await confirmationModal.confirmRestore(
    budget.name,
    `${budget.category.name} - ${budget.amount}`,
    budget.category.color
  );

  if (confirmed) {
    confirmationModal.setLoading(true);
    try {
      await store.restore(id);
      toast.success('Presupuesto restaurado');
      fetchBudgets();
    } catch (e: any) {
      toast.error(e?.message || 'Error al restaurar');
    } finally {
      confirmationModal.setLoading(false);
    }
  }
}

async function toggleStatus(id: number) {
  const budget = budgets.value.find(b => b.id === id);
  if (!budget) return;

  const confirmed = await confirmationModal.confirmStatusChange(
    budget.name,
    budget.is_active
  );

  if (confirmed) {
    confirmationModal.setLoading(true);
    try {
      await store.toggleStatus(id);
      toast.success('Estado actualizado');
      fetchBudgets();
    } catch (e: any) {
      toast.error(e?.message || 'Error al cambiar estado');
    } finally {
      confirmationModal.setLoading(false);
    }
  }
}

function fetchBudgets() {
  store.fetchAll(cleanFilters(filters));
}

function cleanFilters(obj: typeof filters) {
  const out: Record<string, any> = {};
  if (obj.category_id) out.category_id = obj.category_id;
  if (obj.period) out.period = obj.period;
  if (typeof obj.is_active === 'boolean') out.is_active = obj.is_active;
  if (obj.start_date) out.start_date = obj.start_date;
  if (obj.end_date) out.end_date = obj.end_date;
  return out;
}

// Lifecycle
onMounted(async () => {
  // Load categories first if not loaded
  if (!categories.value.length) {
    await categoriesStore.fetchAll();
  }
  
  // Then load budgets
  fetchBudgets();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .dashboard-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.animate-modal {
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
