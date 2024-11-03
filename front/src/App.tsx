import React, { useState } from 'react';
import { Link } from "react-router-dom";
import SubmitTest from './components/SubmitTest';
import Header from './components/Header';
import { Drawer, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Toolbar, Box, Typography, Collapse, TextField, Button } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
                <ListItemIcon><MailIcon /></ListItemIcon>
                <ListItemText primary="Character Search" />
                {openCharacterSearch ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openCharacterSearch} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="キャラクター名を検索"
                  variant="outlined"
                  fullWidth
                />
                <Button variant="contained" color="primary">検索</Button>
              </Box>
            </Collapse>

            {/* Title Search Section */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleToggleTitleSearch}>
                <ListItemIcon><MailIcon /></ListItemIcon>
                <ListItemText primary="Title Search" />
                {openTitleSearch ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openTitleSearch} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="タイトルを検索"
                  variant="outlined"
                  fullWidth
                />
                <Button variant="contained" color="primary">検索</Button>
              </Box>
            </Collapse>
          </List>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}> {/* p: 3をp: 2に変更 */}
          <ListGrave />
        </Box>
      </div>
    </div>
  );
}

export default App;
