import { defineStore } from 'pinia';
import { 
  sendMessage, 
  getConversationStats, 
  clearConversation, 
  getChatSuggestions,
  getFinancialSummary 
} from '../../services/chat/chat';
import type { 
  ChatMessage, 
  ChatState
} from '../../types/chat/chat';

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    isLoading: false,
    isTyping: false,
    error: null,
    suggestions: null,
    stats: null,
    summary: null,
  }),

  getters: {
    hasMessages: (state) => state.messages.length > 0,
    lastMessage: (state) => state.messages[state.messages.length - 1] || null,
    userMessages: (state) => state.messages.filter(msg => msg.isUser),
    botMessages: (state) => state.messages.filter(msg => !msg.isUser),
    isConversationActive: (state) => state.stats?.is_active || false,
  },

  actions: {
    /**
     * Enviar mensaje al bot
     */
    async sendMessage(content: string) {
      if (!content.trim()) return;

      this.isLoading = true;
      this.error = null;

      // Agregar mensaje del usuario
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: content.trim(),
        isUser: true,
        timestamp: new Date().toISOString(),
      };

      this.messages.push(userMessage);      try {
        // Simular que el bot está escribiendo
        this.isTyping = true;

        const response = await sendMessage(content);

        // Agregar respuesta del bot
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          content: response.data.response,
          isUser: false,
          timestamp: response.data.timestamp,
          suggestions: response.data.suggestions,
        };

        this.messages.push(botMessage);        // Actualizar estadísticas si es necesario
        if (this.stats) {
          this.stats.total_messages += 2; // Usuario + bot
          this.stats.last_message = response.data.timestamp;
          this.stats.is_active = true;
        }

      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al enviar mensaje';
        
        // Agregar mensaje de error
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
          isUser: false,
          timestamp: new Date().toISOString(),
        };

        this.messages.push(errorMessage);
      } finally {
        this.isLoading = false;
        this.isTyping = false;
      }
    },

    /**
     * Obtener estadísticas de la conversación
     */
    async fetchStats() {
      try {
        this.stats = await getConversationStats();
      } catch (error: any) {
        console.error('Error fetching conversation stats:', error);
      }
    },

    /**
     * Limpiar conversación
     */
    async clearMessages() {
      try {
        await clearConversation();
        this.messages = [];
        this.stats = null;
        this.error = null;
        
        // Agregar mensaje de bienvenida
        this.addWelcomeMessage();
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al limpiar conversación';
      }
    },

    /**
     * Obtener sugerencias
     */
    async fetchSuggestions() {
      try {
        this.suggestions = await getChatSuggestions();
      } catch (error: any) {
        console.error('Error fetching suggestions:', error);
      }
    },

    /**
     * Obtener resumen financiero
     */
    async fetchSummary() {
      try {
        this.summary = await getFinancialSummary();
      } catch (error: any) {
        console.error('Error fetching financial summary:', error);
      }
    },

    /**
     * Enviar mensaje sugerido
     */
    async sendSuggestedMessage(suggestion: string) {
      await this.sendMessage(suggestion);
    },

    /**
     * Agregar mensaje de bienvenida
     */
    addWelcomeMessage() {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: '¡Hola! Soy FinBot, tu asistente financiero personal. ¿En qué puedo ayudarte hoy?',
        isUser: false,
        timestamp: new Date().toISOString(),
        suggestions: [
          '¿Cómo están mis finanzas?',
          'Analiza mis gastos',
          'Dame consejos de ahorro',
          'Revisa mis presupuestos'
        ],
      };

      if (this.messages.length === 0) {
        this.messages.push(welcomeMessage);
      }
    },

    /**
     * Marcar error como leído
     */
    clearError() {
      this.error = null;
    },

    /**
     * Inicializar chat
     */
    async initialize() {
      // Cargar datos iniciales
      await Promise.all([
        this.fetchStats(),
        this.fetchSuggestions(),
        this.fetchSummary(),
      ]);

      // Si no hay mensajes, agregar mensaje de bienvenida
      if (this.messages.length === 0) {
        this.addWelcomeMessage();
      }
    },

    /**
     * Scroll al último mensaje
     */
    scrollToLastMessage() {
      // Esta función será llamada desde el componente
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    },
  },
});
