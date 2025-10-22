import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";

export default function ChatPage() {
  const {
    chats,
    selectedChat,
    messages,
    loading,
    modelName,
    fetchChats,
    fetchChatContent,
    selectChat,
    createChatAction,
    sendMessageAction,
    deleteChatAction,
    updateChatTitleAction,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleCreateChat = async () => {
    await createChatAction({
      model_name: modelName,
      message_content: input || "hello",
    });
    setInput("");
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !input.trim()) return;
    await sendMessageAction({
      chat_id: selectedChat.id,
      model_name: modelName,
      message_content: input,
    });
    setInput("");
  };

  const handleUpdateTitle = async () => {
    if (!selectedChat || !newTitle.trim()) return;
    await updateChatTitleAction(selectedChat.id, { title: newTitle });
    setNewTitle("");
  };

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
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => {
                selectChat(chat);
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
                  deleteChatAction(chat.id);
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
              <h2 className="font-semibold text-lg">{selectedChat.title}</h2>
              <div className="flex gap-2 items-center">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Rename chat..."
                  className="border rounded px-2 py-1 text-sm"
                />
                <button
                  onClick={handleUpdateTitle}
                  className="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300"
                >
                  Update
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sent_by === "user" ? "justify-end" : "justify-start"
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
                onClick={handleSendMessage}
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
