import { Box, Paper } from "@mui/material";
import { Message } from "@/lib/storage";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <Box display="flex" justifyContent={isUser ? "flex-end" : "flex-start"}>
      <Paper
        sx={{
          p: 2,
          maxWidth: "70%",
          bgcolor: isUser ? "primary.main" : "background.paper",
        }}
      >
        {message.content}
      </Paper>
    </Box>
  );
}
