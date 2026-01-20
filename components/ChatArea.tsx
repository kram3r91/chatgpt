"use client";

import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Chat, saveChats } from "@/lib/storage";
import MessageBubble from "./MessageBubble";
import { useState } from "react";

export default function ChatArea({
  chat,
  updateChat,
  chats,
}: {
  chat: Chat;
  chats: Chat[];
  updateChat: (chat: Chat) => void;
}) {
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;

    const updated: Chat = {
      ...chat,
      messages: [
        ...chat.messages,
        { role: "user", content: input } as const,
        { role: "assistant", content: "" } as const,
      ],
    };

    updateChat(updated);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: updated.messages.slice(0, -1),
      }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    let text = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      text += decoder.decode(value);

      updated.messages[updated.messages.length - 1].content = text;
      updateChat({ ...updated });
      saveChats(chats.map(c => (c.id === updated.id ? updated : c)));
    }
  };

  return (
    <Box flex={1} display="flex" flexDirection="column">
      <Box flex={1} p={3} overflow="auto">
        {chat.messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
      </Box>

      <Box p={2} display="flex" gap={2}>
        <TextField
          fullWidth
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Scrie mesajul..."
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <IconButton onClick={send}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
