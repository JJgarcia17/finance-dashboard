import { httpGet, httpPost, httpDelete } from '../common/http.ts';
import type { 
  ApiChatResponse,
  ConversationStats, 
  ChatSuggestions,
  FinancialSummary 
} from '../../types/chat/chat';

const BASE = '/chat';

/**
 * Enviar mensaje al bot financiero
 */
export async function sendMessage(message: string): Promise<ApiChatResponse> {
  const data = await httpPost(`${BASE}/message`, { message });
  return data;
}

/**
 * Obtener estadísticas de la conversación
 */
export async function getConversationStats(): Promise<ConversationStats> {
  const data = await httpGet(`${BASE}/stats`);
  return data.data;
}

/**
 * Limpiar historial de conversación
 */
export async function clearConversation(): Promise<void> {
  await httpDelete(`${BASE}/clear`);
}

/**
 * Obtener sugerencias de mensajes
 */
export async function getChatSuggestions(): Promise<ChatSuggestions> {
  const data = await httpGet(`${BASE}/suggestions`);
  return data.data;
}

/**
 * Obtener resumen financiero rápido
 */
export async function getFinancialSummary(): Promise<FinancialSummary> {
  const data = await httpGet(`${BASE}/summary`);
  return data.data;
}
