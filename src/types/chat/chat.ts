export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  suggestions?: string[];
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  context_used: boolean;
  suggestions: string[];
  error?: boolean;
}

export interface ApiChatResponse {
  success: boolean;
  data: ChatResponse;
}

export interface ConversationStats {
  total_messages: number;
  conversation_started: string | null;
  last_message: string | null;
  is_active: boolean;
}

export interface ChatSuggestions {
  general: string[];
  analysis: string[];
  budgets: string[];
  planning: string[];
}

export interface FinancialSummary {
  summary: string;
  last_updated: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  suggestions: ChatSuggestions | null;
  stats: ConversationStats | null;
  summary: FinancialSummary | null;
}

export type ChatMessageType = 'user' | 'bot' | 'system' | 'error';
