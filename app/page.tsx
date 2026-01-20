"use client";

import { Box } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { Chat, loadChats, saveChats, clearChats } from "@/lib/storage";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export default function Page() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    const loaded = loadChats();
    if (loaded.length) {
      setChats(loaded);
      setCurrentId(loaded[0].id);
    } else newChat();
  }, []);

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

  const updateChat = (chat: Chat) => {
    const updated = chats.map(c => (c.id === chat.id ? chat : c));
    setChats(updated);
    saveChats(updated);
  };

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
