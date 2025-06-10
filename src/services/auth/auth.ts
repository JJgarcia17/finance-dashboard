import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/api/v1';

export async function login(email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const token = response.data.token || response.data.data?.token;
    if (!token) throw new Error('Token no recibido');
    localStorage.setItem('auth_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Credenciales incorrectas');
  }
}

export function logout() {
  localStorage.removeItem('auth_token');
  delete axios.defaults.headers.common['Authorization'];
}

export function getToken() {
  return localStorage.getItem('auth_token');
}
