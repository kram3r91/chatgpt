"use client";

import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageBubble from "./MessageBubble";
import { Chat, saveChats } from "@/lib/storage";
import { useState, useEffect, useRef } from "react";

// Funcții pentru mesaj user/assistant
function userMessage(content: string) {
  return { role: "user", content } as const;
}
function assistantMessage(content: string) {
  return { role: "assistant", content } as const;
}

export default function ChatArea({
  chat,
  chats,
  updateChat,
}: {
  chat: Chat;
  chats: Chat[];
  updateChat: (chat: Chat) => void;
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll la ultimul mesaj
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll automat când chat.messages se schimbă
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  // Trimite mesaj
  const send = async () => {
    if (!input.trim()) return;

    // Adaugă mesaj user + placeholder assistant
    const updated: Chat = {
      ...chat,
      messages: [...chat.messages, userMessage(input), assistantMessage("")],
    };

    updateChat(updated);
    setInput("");

    try {
      // Streaming răspuns OpenAI
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: updated.messages.slice(0, -1), // trimitem doar mesajele anterioare
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        text += decoder.decode(value);

        // Update content mesaj assistant token-by-token
        updated.messages[updated.messages.length - 1].content = text;

        updateChat({ ...updated });
        saveChats(chats.map(c => (c.id === updated.id ? updated : c)));

        // ⬇ Scroll automat în timp ce vine răspunsul
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error streaming chat:", err);
    }
  };

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      sx={{ height: "100vh" }}
    >
      {/* Chat messages */}
      <Box
        flex={1}
        p={2}
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": { width: "6px" },
        }}
      >
        {chat.messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input user */}
      <Box p={1} display="flex" gap={1} sx={{ flexShrink: 0 }}>
        <TextField
          fullWidth
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Scrie mesajul..."
          onKeyDown={e => e.key === "Enter" && send()}
          size="small"
        />
        <IconButton onClick={send} color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
