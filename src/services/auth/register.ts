import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/api/v1';

export async function register(name: string, email: string, password: string, passwordConfirmation?: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation ?? password
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'No se pudo crear la cuenta');
  }
}
