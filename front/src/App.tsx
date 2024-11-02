import React from 'react';
import { Link } from "react-router-dom";
import SubmitTest from './components/SubmitTest';
import Header from './components/Header';
import { Drawer, List, ListItem, ListItemText, ListItemButton, Button, ListItemIcon } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import './App.css';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200 }}>
        <Header />
      </div>

      {/* サイドバーとメインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, marginTop: 64 }}> {/* Headerの高さ分下に配置 */}
        {/* サイドバー */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{ marginTop: '64px', width: 240, flexShrink: 0, zIndex: 1100 }} // Headerの高さ分下に配置
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/character_search">
                <ListItemIcon><MailIcon /></ListItemIcon>
                <ListItemText primary="Character Search" />
              </ListItemButton>
            </ListItem>
            {/* 他のリンクを追加可能 */}
          </List>
        </Drawer>

        {/* メインコンテンツ */}
        <div >
          <Button component={Link} to="/character_search">Click</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
