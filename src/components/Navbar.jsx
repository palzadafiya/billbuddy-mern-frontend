import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar src="/logo.png" alt="BillBuddy" />
        <Typography variant="h6" component="div">
          BillBuddy
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={RouterLink} to="/" onClick={handleDrawerToggle}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={RouterLink} to="/groups" onClick={handleDrawerToggle}>
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Groups" />
        </ListItem>
        <ListItem button component={RouterLink} to="/profile" onClick={handleDrawerToggle}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" elevation={0} sx={{ background: 'transparent' }}>
      <Toolbar sx={{ 
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      }}>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src="/logo.png" alt="BillBuddy" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              BillBuddy
            </Typography>
          </Box>
        )}

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
              sx={{ color: 'text.primary' }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/groups"
              startIcon={<GroupIcon />}
              sx={{ color: 'text.primary' }}
            >
              Groups
            </Button>
            <Button
              component={RouterLink}
              to="/create-group"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ 
                background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #34495e 30%, #2980b9 90%)',
                },
              }}
            >
              New Group
            </Button>
          </Box>
        )}

        <Box sx={{ ml: 'auto' }}>
          {user ? (
            <>
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 2 }}
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar sx={{ width: 32, height: 32 }}>{user.name[0]}</Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                  <PersonIcon sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{ 
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                sx={{ 
                  background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #34495e 30%, #2980b9 90%)',
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 