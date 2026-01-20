"use client";

import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageBubble from "./MessageBubble";
import { Chat, saveChats } from "@/lib/storage";
import { useState } from "react";

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

  const send = async () => {
    if (!input.trim()) return;

    const updated: Chat = {
      ...chat,
      messages: [...chat.messages, userMessage(input), assistantMessage("")],
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
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      sx={{ height: "100vh" }}
    >
      <Box
        flex={1}
        p={2}
        overflow="auto"
        sx={{ "&::-webkit-scrollbar": { width: "6px" } }}
      >
        {chat.messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
      </Box>

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
