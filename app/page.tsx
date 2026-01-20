"use client";

import { Box } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { Chat, saveChats, clearChats } from "@/lib/storage";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function Page() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentId, setCurrentId] = useState("");

  // 1️⃣ Functia pentru creare chat nou
  const newChat = () => {
    const chat: Chat = {
      id: uuid(),
      title: "New Chat",
      messages: [],
    };
    const updated = [chat, ...chats];
    setChats(updated);
    setCurrentId(chat.id);
    saveChats(updated);
  };

  // 2️⃣ Încarcă chat-uri doar pe client
  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem("my-chatgpt-chats") || "[]");
    if (loaded.length) {
      setChats(loaded);
      setCurrentId(loaded[0].id);
    } else {
      newChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3️⃣ Functia pentru update chat
  const updateChat = (chat: Chat) => {
    const updated = chats.map(c => (c.id === chat.id ? chat : c));
    setChats(updated);
    saveChats(updated);
  };

  // 4️⃣ Functia Clear All → șterge tot și creează un chat gol
  const handleClear = () => {
    clearChats();
    const chat: Chat = {
      id: uuid(),
      title: "New Chat",
      messages: [],
    };
    setChats([chat]);
    setCurrentId(chat.id);
    saveChats([chat]);
  };

  const current = chats.find(c => c.id === currentId);
  if (!current) return null;

  // 5️⃣ Layout responsive
  return (
    <Box
      display="flex"
      height="100vh"
      flexDirection={{ xs: "column", sm: "row" }}
    >
      <Sidebar
        chats={chats}
        currentId={currentId}
        onSelect={setCurrentId}
        onNew={newChat}
        onClear={handleClear}
      />
      <ChatArea chat={current} chats={chats} updateChat={updateChat} />
    </Box>
  );
}
