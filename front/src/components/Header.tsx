import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import { pink, purple, teal } from '@mui/material/colors';
import { Link } from "react-router-dom";
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors'; // greyをインポート

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: teal[600] }}>
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link to="/">
            <Button sx={{ width: 160,'&:hover': { backgroundColor: grey[500] },}}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: pink[50] }}>
                    My App
                </Typography>
            </Button>
          </Link>
          
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {/* 横に大きな半円のボタン */}
            <Link to="/create_grave" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  width: 160, // 横幅を160pxに変更
                  height: 50,
                  borderRadius: '0 0 80px 80px', // 半円の形を作る
                  backgroundColor: grey[700], // 半円の色を灰色に変更
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: grey[500] }, // ホバー時の色
                }}
              >
                <Typography variant="subtitle1" sx={{ color: pink[50] }}>
                  Create Grave
                </Typography>
              </Box>
            </Link>
          </Box>
          <Button
            variant="contained"
            sx={{ backgroundColor: pink[500], '&:hover': { backgroundColor: pink[700] }, margin: 1 }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: purple[500], '&:hover': { backgroundColor: purple[700] }, margin: 1 }}
          >
            Signup
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
