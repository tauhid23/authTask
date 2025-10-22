import { create } from "zustand";
import {
  createChat,
  addMessageToChat,
  getUsersChatList,
  getChatContent,
  updateChatTitle,
  deleteChat,
  type Chat,
  type Message,
  type CreateChatPayload,
  type AddMessagePayload,
  type UpdateChatTitlePayload,
} from "../api/chatApi";
import { useAuthStore } from "./useAuthStore";

interface ChatStoreState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  modelName: string;

  fetchChats: () => Promise<void>;
  fetchChatContent: (chatId: number) => Promise<void>;
  createChatAction: (payload: CreateChatPayload) => Promise<void>;
  sendMessageAction: (payload: AddMessagePayload) => Promise<void>;
  updateChatTitleAction: (chatId: number, payload: UpdateChatTitlePayload) => Promise<void>;
  deleteChatAction: (chatId: number) => Promise<void>;
  selectChat: (chat: Chat | null) => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  chats: [],
  selectedChat: null,
  messages: [],
  loading: false,
  error: null,
  modelName: "Chartwright",

  selectChat: (chat) => set({ selectedChat: chat }),

  fetchChats: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    set({ loading: true, error: null });
    const res = await getUsersChatList(token);
    if (res.success && res.data) {
      const chatList = (res.data as any).data || res.data;
      set({ chats: Array.isArray(chatList) ? chatList : [] });
    } else {
      set({ error: res.error || "Failed to fetch chats" });
    }
    set({ loading: false });
  },

  fetchChatContent: async (chatId) => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    set({ loading: true, error: null });
    const res = await getChatContent(chatId, token);
    if (res.success && res.data) {
      const msgList = (res.data as any).data || res.data;
      set({ messages: Array.isArray(msgList) ? msgList : [] });
    } else {
      set({ error: res.error || "Failed to fetch messages" });
    }
    set({ loading: false });
  },

  createChatAction: async (payload) => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    set({ loading: true, error: null });
    const res = await createChat(payload, token);
    if (res.success && res.data) {
      const chatData = (res.data as any).data || res.data;
      set((state) => ({
        chats: [chatData, ...state.chats],
        selectedChat: chatData,
        messages: chatData.messages || [],
      }));
    } else {
      set({ error: res.error || "Failed to create chat" });
    }
    set({ loading: false });
  },

  sendMessageAction: async (payload) => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    set({ loading: true, error: null });
    const res = await addMessageToChat(payload, token);
    if (res.success && res.data) {
      const newMsg = (res.data as any).data || res.data;
      set((state) => ({
        messages: [...state.messages, newMsg],
      }));
    } else {
      set({ error: res.error || "Failed to send message" });
    }
    set({ loading: false });
  },

  updateChatTitleAction: async (chatId, payload) => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    set({ loading: true, error: null });
    const res = await updateChatTitle(chatId, payload, token);
    if (res.success && res.data) {
      const updatedChat = (res.data as any).data || res.data;
      set((state) => ({
        chats: state.chats.map((c) =>
          c.id === chatId ? { ...c, title: updatedChat.title } : c
        ),
        selectedChat:
          state.selectedChat && state.selectedChat.id === chatId
            ? { ...state.selectedChat, title: updatedChat.title }
            : state.selectedChat,
      }));
    } else {
      set({ error: res.error || "Failed to update chat title" });
    }
    set({ loading: false });
  },

  deleteChatAction: async (chatId) => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    await deleteChat(chatId, token);
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== chatId),
      selectedChat:
        state.selectedChat?.id === chatId ? null : state.selectedChat,
      messages:
        state.selectedChat?.id === chatId ? [] : state.messages,
    }));
  },
}));
