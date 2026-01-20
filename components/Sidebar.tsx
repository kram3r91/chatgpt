"use client";

import { Box, Button, List, ListItemButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Chat } from "@/lib/storage";

type Props = {
  chats: Chat[];
  currentId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
};

export default function Sidebar({ chats, currentId, onSelect, onNew }: Props) {
  return (
    <Box width={260} bgcolor="background.paper" p={2}>
      <Button
        fullWidth
        startIcon={<AddIcon />}
        onClick={onNew}
        variant="contained"
      >
        New Chat
      </Button>

      <List sx={{ mt: 2 }}>
        {chats.map(c => (
          <ListItemButton
            key={c.id}
            selected={c.id === currentId}
            onClick={() => onSelect(c.id)}
          >
            <Typography noWrap>{c.title}</Typography>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
