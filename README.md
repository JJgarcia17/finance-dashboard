# 💰 Finance Dashboard - Frontend

Una aplicación web moderna para la gestión de finanzas personales construida con Vue.js 3, TypeScript y Tailwind CSS. Esta aplicación permite a los usuarios administrar sus cuentas, transacciones, categorías y presupuestos de manera intuitiva y eficiente.

## 📸 Características Principales

- **🔐 Autenticación Moderna**: Sistema de login/registro con diseño glassmorphism y animaciones
- **💳 Gestión de Cuentas**: Manejo completo de cuentas bancarias, tarjetas de crédito, efectivo, etc.
- **📊 Transacciones**: Control detallado de ingresos, gastos y transferencias
- **📋 Categorías**: Organización de transacciones por categorías personalizables
- **💰 Presupuestos**: Creación y seguimiento de presupuestos por categorías
- **📈 Dashboard**: Visualización de estadísticas y resúmenes financieros
- **🎨 UI/UX Moderna**: Diseño responsive con efectos glassmorphism y animaciones

## 🛠️ Stack Tecnológico

### Frontend Core
- **Vue.js 3** - Framework principal con Composition API
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Herramienta de build y desarrollo
- **Tailwind CSS** - Framework CSS utility-first

### Estado y Navegación
- **Pinia** - Gestión de estado global
- **Vue Router** - Enrutamiento SPA
- **Axios** - Cliente HTTP para comunicación con API

### Testing y Calidad
- **Vitest** - Framework de testing
- **Vue Test Utils** - Utilidades para testing de componentes
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

### UI/UX
- **FontAwesome** - Iconografía
- **Vue Toast Notification** - Notificaciones
- **Animaciones CSS** - Efectos visuales personalizados

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
src/
├── assets/                 # Recursos estáticos
├── components/            # Componentes reutilizables
│   ├── ConfirmationModal.vue
│   ├── DashboardLayout.vue
│   ├── MetricCard.vue
│   └── WelcomeBanner.vue
├── composables/           # Lógica reutilizable
│   └── useConfirmationModal.ts
├── router/                # Configuración de rutas
│   └── index.ts
├── services/              # Servicios de API
│   ├── auth/
│   ├── account/
│   ├── category/
│   ├── transaction/
│   ├── budget/
│   ├── dashboard/
│   └── common/
├── stores/                # Estado global (Pinia)
│   ├── auth/
│   ├── account/
│   ├── category/
│   ├── transaction/
│   └── budget/
├── types/                 # Definiciones TypeScript
│   ├── account/
│   ├── category/
│   ├── transaction/
│   ├── budget/
│   └── dashboard/
├── utils/                 # Utilidades
│   └── iconValidation.ts
├── views/                 # Páginas/Vistas
│   ├── auth/
│   ├── category/
│   ├── transaction/
│   └── budget/
├── App.vue
├── main.ts
└── style.css
```

## 🎯 Patrones de Diseño Implementados

### 1. **Composition API Pattern**
Uso consistente del Composition API de Vue 3 para mejor reutilización de lógica:

```typescript
// Ejemplo en stores
export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);
  const loading = ref(false);
  
  async function fetchAll(params: AccountFilters = {}) {
    // Lógica de fetch
  }
  
  return { accounts, loading, fetchAll };
});
```

### 2. **Service Layer Pattern**
Separación clara entre la lógica de UI y comunicación con API:

```typescript
// services/account/accounts.ts
export async function fetchAccounts(filters: AccountFilters = {}) {
  const { data } = await axios.get(BASE, { 
    params: cleanParams(filters), 
    headers: getCommonHeaders() 
  });
  return data;
}
```

### 3. **Store Pattern con Pinia**
Gestión de estado centralizada y tipada:

```typescript
// Cada módulo tiene su store específico
- useAuthStore()      // Autenticación
- useAccountsStore()  // Cuentas
- useTransactionsStore() // Transacciones
- useCategoriesStore()   // Categorías
- useBudgetsStore()      // Presupuestos
```

### 4. **TypeScript First**
Tipado exhaustivo en toda la aplicación:

```typescript
export interface Account {
  id: number;
  name: string;
  type: AccountType;
  currency: AccountCurrency;
  current_balance: string;
  // ... más propiedades
}
```

### 5. **Composables Pattern**
Lógica reutilizable extraída en composables:

```typescript
// composables/useConfirmationModal.ts
export function useConfirmationModal() {
  const isOpen = ref(false);
  const loading = ref(false);
  
  function openModal(config: ModalConfig) {
    // Lógica del modal
  }
  
  return { isOpen, loading, openModal };
}
```

### 6. **Lazy Loading Pattern**
Carga dinámica de componentes y rutas:

```typescript
// Router con lazy loading
{
  path: '/accounts',
  component: () => import('../views/account/Accounts.vue'),
  meta: { requiresAuth: true }
}

// Componentes con defineAsyncComponent
const DashboardLayout = defineAsyncComponent(
  () => import('../../components/DashboardLayout.vue')
);
```

## 🔒 Seguridad y Autenticación

### Protección de Rutas
```typescript
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const authRequired = !publicPages.includes(to.path);
  
  if (authRequired && !auth.isAuthenticated) {
    return next('/login');
  }
  next();
});
```

### Gestión de Tokens
- Almacenamiento seguro en localStorage
- Headers automáticos en peticiones HTTP
- Sincronización entre pestañas
- Restauración de sesión automática

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
:root {
  --color-primary: #1A237E;        /* Azul profundo */
  --color-primary-light: #3949AB;  /* Azul medio */
  --color-accent: #FFD600;         /* Amarillo dorado */
  --color-success: #43A047;        /* Verde éxito */
  --color-danger: #E53935;         /* Rojo elegante */
  --color-bg: #F5F7FA;             /* Fondo claro */
  --color-surface: #FFFFFF;        /* Superficies */
}
```

### Efectos Visuales
- **Glassmorphism**: Efectos de cristal con `backdrop-blur`
- **Animaciones CSS**: Transiciones y animaciones personalizadas
- **Responsive Design**: Adaptable a todos los dispositivos
- **Micro-interacciones**: Feedback visual en acciones del usuario

## 🧪 Testing

### Estrategia de Testing
```
tests/
├── setup.ts              # Configuración global
├── auth/                 # Tests de autenticación
├── account/              # Tests de cuentas
├── category/             # Tests de categorías
├── transaction/          # Tests de transacciones
└── budget/               # Tests de presupuestos
```

### Tipos de Tests
- **Unit Tests**: Stores y composables
- **Component Tests**: Componentes Vue
- **Integration Tests**: Flujos completos

### Cobertura
- Testing de stores con mocks de servicios
- Testing de componentes con Vue Test Utils
- Mocking de dependencias externas

## 🚀 Comandos de Desarrollo

```bash
# Instalación de dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Tests
npm run test

# Tests en modo watch
npm run test:run
```

## 📦 Gestión de Estado

### Estructura de Stores

Cada módulo funcional tiene su propio store con:

```typescript
// Patrón consistente en todos los stores
export const useModuleStore = defineStore('module', () => {
  // State
  const items = ref<Item[]>([]);
  const loading = ref(false);
  const error = ref('');
  const filters = ref<Filters>({});
  
  // Actions
  async function fetchAll(params: Filters = {}) { /* */ }
  async function create(payload: Payload) { /* */ }
  async function update(id: number, payload: Partial<Payload>) { /* */ }
  async function remove(id: number) { /* */ }
  
  return { items, loading, error, fetchAll, create, update, remove };
});
```

### Comunicación con API

Cada store interactúa con su servicio correspondiente:

```
Store ↔ Service ↔ API Backend
```

## 🔧 Configuración

### Variables de Entorno
```env
VITE_API_URL=http://localhost:8000/api
```

### Configuración de Vite
- Hot Module Replacement (HMR)
- TypeScript support
- Path aliasing
- Build optimizations

## 📱 Características de UI/UX

### Responsive Design
- Mobile-first approach
- Breakpoints optimizados
- Navegación adaptativa

### Accesibilidad
- Etiquetas ARIA
- Navegación por teclado
- Contraste de colores adecuado

### Performance
- Lazy loading de rutas
- Componentes optimizados
- Bundle splitting automático

## 🤝 Contribución

### Estándares de Código
- ESLint para linting
- Prettier para formateo
- Conventional Commits
- TypeScript strict mode

### Estructura de Commits
```
feat: añadir nueva funcionalidad
fix: corregir bug
refactor: refactorizar código
style: cambios de estilo
test: añadir tests
docs: actualizar documentación
```

## 📄 Licencia

Este proyecto es parte de un sistema de gestión financiera personal.

---

**Desarrollado con ❤️ usando Vue.js 3 + TypeScript + Tailwind CSS**
