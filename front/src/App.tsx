import React, { useState } from 'react';
import { Link } from "react-router-dom";
import SubmitTest from './components/SubmitTest';
import Header from './components/Header';
import { Drawer, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Toolbar, Box, Typography, Collapse, TextField, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import './App.css';
import ListGrave from './components/ListGrave';
import CharacterSearch from './components/CharacterSearch';

function App() {
  const [openCharacterSearch, setOpenCharacterSearch] = useState(false);
  const [openTitleSearch, setOpenTitleSearch] = useState(false);

  const handleToggleCharacterSearch = () => {
    setOpenCharacterSearch((prevOpen) => !prevOpen);
  };

  const handleToggleTitleSearch = () => {
    setOpenTitleSearch((prevOpen) => !prevOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundImage: 'url(/backgrounds/okumono_kumo225.png)', // 画像のパス
        backgroundSize: 'cover', // 画像をカバー
        backgroundPosition: 'center', // 画像の位置を中央に
        backgroundRepeat: 'no-repeat' // 繰り返しを防ぐ
      }}
    >
      {/* Header */}
      <Header />

      {/* Sidebar and Main Content */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {/* Character Search Section */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleToggleCharacterSearch}>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Character Search" />
                {openCharacterSearch ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openCharacterSearch} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* キャラクター検索用のTextFieldとButton */}
              </Box>
            </Collapse>

            {/* Title Search Section */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleToggleTitleSearch}>
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary="Title Search" />
                {openTitleSearch ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openTitleSearch} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* タイトル検索用のTextFieldとButton */}
              </Box>
            </Collapse>
          </List>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <ListGrave />
        </Box>
      </div>
    </Box>
  );
}

export default App;
