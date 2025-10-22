import { useEffect, useState } from "react";
import {
  createChat,
  addMessageToChat,
  getUsersChatList,
  getChatContent,
  deleteChat,
  type Chat,
  type Message,
} from "../api/chatApi";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatPage() {
  const { token } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelName] = useState("Chartwright");
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    if (!token) return;
    const res = await getUsersChatList(token);
    if (res.success && res.data) {
      const chatList = (res.data as any).data || res.data; 
      setChats(Array.isArray(chatList) ? chatList : []);
    }
  };

  const fetchChatContent = async (chatId: number) => {
    if (!token) return;
    const res = await getChatContent(chatId, token);
    if (res.success && res.data) {
      const msgList = (res.data as any).data || res.data;
      setMessages(Array.isArray(msgList) ? msgList : []);
    }
  };

  const handleSendMessage = async () => {
    if (!token || !selectedChat || !input.trim()) return;

    setLoading(true);
    const res = await addMessageToChat(
      {
        chat_id: selectedChat.id,
        model_name: modelName,
        message_content: input,
      },
      token
    );

    if (res.success && res.data) {
      const newMsg = (res.data as any).data || res.data;
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
    } else {
      setError(res.error || "Failed to send message");
    }

    setLoading(false);
  };

  const handleCreateChat = async () => {
    if (!token) {
      setError("No token found! Please login first.");
      return;
    }

    setLoading(true);
    const res = await createChat(
      {
        model_name: modelName,
        message_content: input || "hello",
      },
      token
    );

    if (res.success && res.data) {
      const chatData = (res.data as any).data || res.data;
      setSelectedChat(chatData);
      setMessages(chatData.messages || []);
      setChats((prev) => [chatData, ...prev]); 
    } else {
      setError(res.error || "Failed to create chat");
    }

    setLoading(false);
  };

  const handleDeleteChat = async (chatId: number) => {
    if (!token) return;
    await deleteChat(chatId, token);
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [token]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* LEFT SIDEBAR */}
      <div className="w-1/4 border-r bg-white p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">💬 My Chats</h2>
        <button
          onClick={handleCreateChat}
          className="w-full mb-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          ➕ New Chat
        </button>

        {chats.length === 0 && (
          <p className="text-gray-500 text-center mt-4">No chats yet.</p>
        )}

        <ul>
          {Array.isArray(chats) &&
            chats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  fetchChatContent(chat.id);
                }}
                className={`p-2 mb-2 rounded cursor-pointer flex justify-between items-center ${
                  selectedChat?.id === chat.id
                    ? "bg-blue-100 border border-blue-400"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="truncate">{chat.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </li>
            ))}
        </ul>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            
            <div className="p-4 bg-white border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">
                 {selectedChat.title || "Untitled Chat"}
              </h2>
              <span className="text-gray-500 text-sm">
                {new Date(selectedChat.timestamp).toLocaleString()}
              </span>
            </div>

            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {Array.isArray(messages) &&
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sent_by === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg shadow-sm ${
                        msg.sent_by === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">
                        {msg.message_content}
                      </p>
                      <p className="text-xs text-right mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            
            <div className="p-4 bg-white border-t flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={
                  selectedChat?.id ? handleSendMessage : handleCreateChat
                }
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat or create a new one to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
}
