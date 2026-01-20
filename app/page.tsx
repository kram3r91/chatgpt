"use client";

import { Box } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { Chat, loadChats, saveChats, clearChats } from "@/lib/storage";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function Page() {
  // 1️⃣ Lazy init state → fără warning React
  const [chats, setChats] = useState<Chat[]>(() => {
    const loaded = loadChats();
    return loaded.length ? loaded : [];
  });

  const [currentId, setCurrentId] = useState(() => {
    const loaded = loadChats();
    return loaded.length ? loaded[0].id : "";
  });

  // 2️⃣ Functia pentru creare chat nou
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

  // 3️⃣ Daca nu avem niciun chat la mount, cream unul
  useEffect(() => {
    if (chats.length === 0) {
      newChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4️⃣ Functia pentru update chat
  const updateChat = (chat: Chat) => {
    const updated = chats.map(c => (c.id === chat.id ? chat : c));
    setChats(updated);
    saveChats(updated);
  };

  // 5️⃣ Functia Clear All
  const handleClear = () => {
    clearChats();
    setChats([]);
    newChat();
  };

  const current = chats.find(c => c.id === currentId);
  if (!current) return null;

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
