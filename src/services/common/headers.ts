// Función reutilizable para obtener cabeceras comunes de autenticación y JSON
export function getCommonHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}
