import React from 'react';
import { Link } from "react-router-dom";
import SubmitTest from './components/SubmitTest';
import Header from './components/Header';
import { Drawer, List, ListItem, ListItemText, ListItemButton, Button, ListItemIcon, Toolbar } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import './App.css';
import ListGrave from './components/ListGrave';


function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Header />

      {/* サイドバーとメインコンテンツ */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* サイドバー */}
       
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
          </List>


        {/* メインコンテンツ */}
        <div >
          <ListGrave />
          
        </div>
      </div>
    </div>
  );
}

export default App;
