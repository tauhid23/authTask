export interface Message {
  id: number;
  sent_by: 'user' | 'bot';
  message_content: string;
  model_name: string;
  timestamp: string;
}

export interface Chat {
  id: number;
  owner: number;
  title: string;
  messages: Message[];
  timestamp: string;
}

interface ChatStore {
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
}