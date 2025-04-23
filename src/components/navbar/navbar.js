import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, useMediaQuery, useTheme, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import './navbar.scss';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Function to update user state from localStorage
    const updateUserFromStorage = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    // Update initially
    updateUserFromStorage();
    
    // Listen for login/logout events
    const handleLogin = () => {
      updateUserFromStorage();
    };
    
    const handleLogout = () => {
      updateUserFromStorage();
    };
    
    window.addEventListener('userLogin', handleLogin);
    window.addEventListener('userLogout', handleLogout);
    
    // Cleanup
    return () => {
      window.removeEventListener('userLogin', handleLogin);
      window.removeEventListener('userLogout', handleLogout);
    };
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogout'));
    setUser(null);
    navigate('/');
    handleMenuClose();
  };

  const navigateTo = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // Function to determine home page URL based on user role
  const getHomeUrl = () => {
    if (!user) return '/';
    return user.role === 'tutor' ? '/tutor-home' : '/student-home';
  };

  // Direct navigation handler for the title
  const handleTitleClick = () => {
    const url = getHomeUrl();
    navigate(url);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          {/* Replace this Typography with a clickable button styled like text */}
          <Button 
            onClick={handleTitleClick}
            sx={{ 
              flexGrow: 1,
              justifyContent: 'flex-start', // Align text to the left
              padding: 0,
              fontWeight: 700,
              fontSize: '1.5rem', // Equivalent to h5
              fontFamily: theme.typography.h5.fontFamily,
              background: 'linear-gradient(45deg, #1E88E5, #42A5F5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textTransform: 'none', // Prevent uppercase text
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #1E88E5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                backgroundColor: 'transparent' // No background color change on hover
              }
            }}
          >
            Open 24 Hours
          </Button>
          
          {isMobile ? (
            // Mobile layout with hamburger menu
            <>
              <IconButton
                edge="end"
                color="primary"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                keepMounted
              >
                {user ? (
                  // Authenticated user menu items
                  <>
                    <MenuItem onClick={() => navigateTo(getHomeUrl())}>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                ) : (
                  // Non-authenticated user menu items
                  <>
                    <MenuItem onClick={() => navigateTo('/how-it-works')}>How it Works</MenuItem>
                    <MenuItem onClick={() => navigateTo('/features')}>Features</MenuItem>
                    <MenuItem onClick={() => navigateTo('/login')}>Login</MenuItem>
                    <MenuItem onClick={() => navigateTo('/signup')}>Sign Up</MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            // Desktop layout with buttons
            <>
              {user ? (
                // Show these buttons for authenticated users
                <>
                  <Button 
                    color="primary"
                    onClick={() => navigateTo(getHomeUrl())}
                    sx={{ 
                      mx: 1,
                      color: '#2C3E50',
                      '&:hover': { backgroundColor: 'rgba(30, 136, 229, 0.08)' }
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="contained"
                    sx={{
                      ml: 2,
                      px: 3,
                      py: 1,
                      borderRadius: '50px',
                      background: 'linear-gradient(45deg, #1E88E5, #42A5F5)',
                      boxShadow: '0 4px 14px rgba(30, 136, 229, 0.25)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #1E88E5)',
                        boxShadow: '0 6px 20px rgba(30, 136, 229, 0.35)',
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                // Show these buttons for non-authenticated users
                <>
                  <Button 
                    color="primary" 
                    onClick={() => navigateTo('/how-it-works')}
                    sx={{ 
                      mx: 1,
                      color: '#2C3E50',
                      '&:hover': { backgroundColor: 'rgba(30, 136, 229, 0.08)' }
                    }}
                  >
                    How it Works
                  </Button>
                  <Button 
                    color="primary"
                    onClick={() => navigateTo('/features')}
                    sx={{ 
                      mx: 1,
                      color: '#2C3E50',
                      '&:hover': { backgroundColor: 'rgba(30, 136, 229, 0.08)' }
                    }}
                  >
                    Features
                  </Button>
                  <Button 
                    color="primary"
                    onClick={() => navigateTo('/login')}
                    sx={{ 
                      mx: 1,
                      color: '#2C3E50',
                      '&:hover': { backgroundColor: 'rgba(30, 136, 229, 0.08)' }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigateTo('/signup')}
                    variant="contained"
                    sx={{
                      ml: 2,
                      px: 3,
                      py: 1,
                      borderRadius: '50px',
                      background: 'linear-gradient(45deg, #1E88E5, #42A5F5)',
                      boxShadow: '0 4px 14px rgba(30, 136, 229, 0.25)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #1E88E5)',
                        boxShadow: '0 6px 20px rgba(30, 136, 229, 0.35)',
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;