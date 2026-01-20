export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

const KEY = "chatgpt-chats";

export function loadChats(): Chat[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function saveChats(chats: Chat[]) {
  localStorage.setItem(KEY, JSON.stringify(chats));
}
