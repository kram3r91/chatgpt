import { Box, Paper } from "@mui/material";
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
          p: 1.5,
          maxWidth: "70%",
          bgcolor: isUser ? "primary.main" : "background.paper",
          wordBreak: "break-word",
        }}
      >
        {message.content}
      </Paper>
    </Box>
  );
}
