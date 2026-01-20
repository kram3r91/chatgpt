"use client";

import { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItemButton,
  Typography,
  Drawer,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import { Chat, clearChats } from "@/lib/storage";

export default function Sidebar({
  chats,
  currentId,
  onSelect,
  onNew,
  onClear,
}: {
  chats: Chat[];
  currentId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onClear: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <Box p={2} width={260} bgcolor="background.paper">
      <Button
        fullWidth
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onNew}
      >
        New Chat
      </Button>
      <Button
        fullWidth
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        sx={{ mt: 1 }}
        onClick={() => {
          onClear();
          setMobileOpen(false);
        }}
      >
        Clear All
      </Button>

      <List sx={{ mt: 2 }}>
        {chats.map(chat => (
          <ListItemButton
            key={chat.id}
            selected={chat.id === currentId}
            onClick={() => {
              onSelect(chat.id);
              setMobileOpen(false);
            }}
          >
            <Typography noWrap>{chat.title}</Typography>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        onClick={handleDrawerToggle}
        sx={{ display: { xs: "block", sm: "none" }, m: 1 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar desktop */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>{drawerContent}</Box>

      {/* Sidebar mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: 260 },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
