import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function getCurrentUser() {
  try {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'No se pudo obtener la información del usuario');
  }
}
