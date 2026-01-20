"use client";

import { Box, Paper } from "@mui/material";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/lib/storage";

// Folosim tipurile oficiale Components pentru TS strict
const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <Box
      component="h1"
      sx={{ fontSize: "1.5rem", fontWeight: "bold", my: 1 }}
      {...props}
    >
      {children}
    </Box>
  ),
  h2: ({ children, ...props }) => (
    <Box
      component="h2"
      sx={{ fontSize: "1.3rem", fontWeight: "bold", my: 0.8 }}
      {...props}
    >
      {children}
    </Box>
  ),
  strong: ({ children, ...props }) => (
    <Box
      component="span"
      sx={{ fontWeight: "bold", color: "#10a37f" }}
      {...props}
    >
      {children}
    </Box>
  ),
  em: ({ children, ...props }) => (
    <Box
      component="span"
      sx={{ fontStyle: "italic", color: "#bbb" }}
      {...props}
    >
      {children}
    </Box>
  ),
  li: ({ children, ...props }) => (
    <li style={{ marginBottom: 4 }} {...props}>
      {children}
    </li>
  ),

  // code & pre – singura excepție unde folosim any, deoarece react-markdown nu oferă tip exact
  code: props => (
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
      {props.children}
    </Box>
  ),
  pre: props => (
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
    >
      {props.children}
    </Box>
  ),
};

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
          components={markdownComponents}
        >
          {message.content}
        </ReactMarkdown>
      </Paper>
    </Box>
  );
}
