import { config } from '@vue/test-utils';

// Global test configuration
config.global.stubs = {
  // Stub router components to prevent router errors
  'router-link': true,
  'router-view': true,
  // Stub font awesome icons properly
  'i': {
    template: '<i><slot /></i>'
  },
};

// Mock CSS variables used in components
const mockCSSVariables = {
  '--color-primary': '#6366F1',
  '--color-primary-dark': '#4F46E5',
  '--color-border': '#E5E7EB',
};

// Apply mock CSS variables to document
if (typeof document !== 'undefined') {
  Object.entries(mockCSSVariables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}
