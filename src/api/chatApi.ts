import {apiFetcher} from './/chatFetcher'


export interface Chat {
  id: number;
  owner: number;                  
  title: string;                  
  messages: Message[];            
  timestamp: string;              
}

export interface Message {
  id: number;
  sent_by: "bot" | "user";        
  message_content: string;        
  model_name: string;             
  timestamp: string;
}

export interface CreateChatPayload {
  model_name: string;
  message_content: string;
}

export interface AddMessagePayload {
  chat_id: number;
  model_name: string;
  message_content: string;
}

export interface UpdateChatTitlePayload {
  title: string;
}



export async function createChat(payload: CreateChatPayload, token: string) {
  return await apiFetcher<Chat>("chat/create_chat/", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}


export async function addMessageToChat(payload: AddMessagePayload, token: string) {
  return await apiFetcher<Message>("chat/add_message_to_chat/", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}


export async function getUsersChatList(token: string) {
  return await apiFetcher<Chat[]>("chat/get_users_chat_list/", {
    method: "GET",
  }, token);
}


export async function getChatContent(chatId: number, token: string) {
  return await apiFetcher<Message[]>(`chat/get_a_chat_content/${chatId}/`, {
    method: "GET",
  }, token);
}


export async function updateChatTitle(chatId: number, payload: UpdateChatTitlePayload, token: string) {
  return await apiFetcher<Chat>(`chat/update_chat_title/${chatId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, token);
}


export async function deleteChat(chatId: number, token: string) {
  return await apiFetcher<null>(`chat/delete_chat/${chatId}/`, {
    method: "DELETE",
  }, token);
}
