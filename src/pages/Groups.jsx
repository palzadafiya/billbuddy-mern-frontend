import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  AvatarGroup,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const GroupCard = ({ group, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(group._id);
    handleMenuClose();
  };

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
      },
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {group.name}
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={RouterLink} to={`/group/${group._id}`}>
              View Details
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              Delete Group
            </MenuItem>
          </Menu>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {group.description || 'No description provided'}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<PersonIcon />}
            label={`${group.members.length} members`}
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip
            icon={<MoneyIcon />}
            label={`${group.expenses?.length || 0} expenses`}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AvatarGroup max={4} sx={{ mr: 2 }}>
            {group.members.map((member, index) => (
              <Avatar
                key={index}
                alt={member.user.name}
                src={member.user.avatar}
                sx={{ width: 32, height: 32 }}
              >
                {member.user.name[0]}
              </Avatar>
            ))}
          </AvatarGroup>
        </Box>

        {group.balances && Object.keys(group.balances).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Recent Activity
            </Typography>
            {Object.entries(group.balances).slice(0, 2).map(([userId, balance]) => {
              const member = group.members.find(m => m.user._id === userId);
              if (!member) return null;
              return (
                <Typography
                  key={userId}
                  variant="body2"
                  sx={{
                    color: balance >= 0 ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <MoneyIcon sx={{ fontSize: 16 }} />
                  {member.user.name}: {balance >= 0 ? '+' : ''}₹{Math.abs(balance).toFixed(2)}
                </Typography>
              );
            })}
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/group/${group._id}`}
          variant="contained"
          fullWidth
          sx={{ 
            background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #34495e 30%, #2980b9 90%)',
            },
          }}
        >
          View Group
        </Button>
      </CardActions>
    </Card>
  );
};

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('/api/groups');
        setGroups(response.data);
      } catch (err) {
        setError('Failed to load groups');
        console.error('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`/api/groups/${groupId}`);
      setGroups(groups.filter(group => group._id !== groupId));
    } catch (err) {
      console.error('Error deleting group:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '70vw', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 4,
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }
        }}
      >
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Your Groups
          </Typography>
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
            Create New Group
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {groups.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <GroupIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No groups yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Create your first group to start tracking expenses with friends
            </Typography>
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
              Create Group
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {groups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group._id}>
                <GroupCard group={group} onDelete={handleDeleteGroup} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Groups; 