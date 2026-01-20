"use client";

import { Box, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/lib/storage";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <Box
      display="flex"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      mb={1}
    >
      <Paper
        sx={{
          p: 2,
          maxWidth: "80%",
          bgcolor: isUser ? "primary.main" : "background.paper",
          color: isUser ? "#fff" : "#ddd",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <Box
                component="h1"
                sx={{ fontSize: "1.5rem", fontWeight: "bold", my: 1 }}
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <Box
                component="h2"
                sx={{ fontSize: "1.3rem", fontWeight: "bold", my: 0.8 }}
                {...props}
              />
            ),
            strong: ({ node, ...props }) => (
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#10a37f" }}
                {...props}
              />
            ),
            em: ({ node, ...props }) => (
              <Box
                component="span"
                sx={{ fontStyle: "italic", color: "#bbb" }}
                {...props}
              />
            ),
            li: ({ node, ...props }) => (
              <li style={{ marginBottom: 4 }} {...props} />
            ),
            code: ({ node, inline, className, children, ...props }) => (
              <Box
                component="code"
                sx={{
                  bgcolor: "#2e2e2e",
                  color: "#10a37f",
                  p: 0.5,
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                }}
                {...props}
              >
                {children}
              </Box>
            ),
            pre: ({ node, ...props }) => (
              <Box
                component="pre"
                sx={{
                  bgcolor: "#1a1a1a",
                  color: "#ddd",
                  p: 1,
                  borderRadius: 1,
                  overflowX: "auto",
                }}
                {...props}
              />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </Paper>
    </Box>
  );
}
