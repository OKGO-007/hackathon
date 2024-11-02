import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import { pink, purple } from '@mui/material/colors';
import { Link } from "react-router-dom";
import { Box } from '@mui/material';
import { auth } from './Firebase';
import { User } from 'firebase/auth';

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundImage: 'linear-gradient(to bottom, #87CEEB, #B0E0E6)',
        color: '#fff',
      }}
    >
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '200px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50px',
                padding: '10px 20px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Button sx={{ width: 160, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' } }}>
                <Typography variant="h5" component="div" sx={{ color: '#4B4B4B', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  推しが死んだ
                </Typography>
              </Button>
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Link to="/create_grave" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  width: 160,
                  height: 50,
                  borderRadius: '80px 80px 0 0',
                  backgroundColor: '#a9a9a9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#8c8c8c' },
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography variant="subtitle1" sx={{ color: '#4B4B4B' }}>
                  Create Grave
                </Typography>
              </Box>
            </Link>
          </Box>

          {user ? (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{ backgroundColor: pink[500], '&:hover': { backgroundColor: pink[700] }, margin: 1 }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                component={Link} to="/login"
                sx={{ backgroundColor: pink[500], '&:hover': { backgroundColor: pink[700] }, margin: 1 }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link} to="/signup"
                sx={{ backgroundColor: purple[500], '&:hover': { backgroundColor: purple[700] }, margin: 1 }}
              >
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
