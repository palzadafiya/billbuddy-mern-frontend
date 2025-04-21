import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Group = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [groupRes, expensesRes] = await Promise.all([
          axios.get(`/api/groups/${id}`),
          axios.get(`/api/expenses/group/${id}`),
        ]);

        if (!groupRes.data) {
          throw new Error('Group not found');
        }

        setGroup(groupRes.data);
        setExpenses(expensesRes.data || []);
        
        // Calculate balances based on expenses
        const newBalances = {};
        groupRes.data.members.forEach(member => {
          newBalances[member.user._id] = 0;
        });

        expensesRes.data.forEach(expense => {
          // Add to paidBy's balance
          newBalances[expense.paidBy._id] = (newBalances[expense.paidBy._id] || 0) + expense.amount;
          
          // Subtract from splitAmong's balances
          const splitAmount = expense.amount / expense.splitAmong.length;
          expense.splitAmong.forEach(user => {
            newBalances[user._id] = (newBalances[user._id] || 0) - splitAmount;
          });
        });

        setBalances(newBalances);
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError(err.response?.data?.message || err.message || 'An error occurred while loading the group');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettleUp = async () => {
    try {
      // First create the settlement
      const settlementResponse = await axios.post('/api/settlements', {
        group: id,
        status: 'pending'
      });

      if (settlementResponse.data) {
        // Then send notification emails
        const emailResponse = await axios.post(`/api/settlements/${settlementResponse.data._id}/notify`);
        
        if (emailResponse.data.message.includes('emails sent successfully')) {
          setSuccessMessage('Settlement created and notification emails sent successfully!');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
        } else {
          setSuccessMessage('Settlement created but email notifications were not sent.');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
        }

        // Refresh group data
        const updatedGroup = await axios.get(`/api/groups/${id}`);
        setGroup(updatedGroup.data);
      }
    } catch (err) {
      console.error('Error settling up:', err);
      setError('Failed to settle up. Please try again.');
    }
  };

  const handleAddExpense = () => {
    if (!id) {
      setError('Invalid group ID');
      return;
    }
    navigate(`/add-expense/${id}`);
  };

  const handleAddMember = () => {
    if (!id) {
      setError('Invalid group ID');
      return;
    }
    navigate(`/add-member/${id}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/groups')}>
          Back to Groups
        </Button>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Group not found</Alert>
        <Button variant="contained" onClick={() => navigate('/groups')} sx={{ mt: 2 }}>
          Back to Groups
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {showSuccess && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setShowSuccess(false)}
        >
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {/* Group Info Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h5" component="div">
                  {group.name}
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddExpense}
                    sx={{ mr: 2 }}
                  >
                    Add Expense
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAddMember}
                    sx={{ mr: 2 }}
                  >
                    Add Member
                  </Button>
                  <IconButton onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleSettleUp} disabled={group.isSettled}>
                      {group.isSettled ? 'Settled' : 'Settle Up'}
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {group.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {group.members.map((member, index) => (
                  <Chip
                    key={`${member.user._id}-${index}`}
                    avatar={<Avatar>{member.user.name[0]}</Avatar>}
                    label={`${member.user.name} (Rs. ${balances[member.user._id]?.toFixed(2) || '0.00'})`}
                    color={
                      balances[member.user._id] > 0
                        ? 'success'
                        : balances[member.user._id] < 0
                        ? 'error'
                        : 'default'
                    }
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Expenses Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Expenses
              </Typography>
              <List>
                {expenses.map((expense) => (
                  <React.Fragment key={expense._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <MoneyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={expense.description}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Rs. {expense.amount}
                            </Typography>
                            {` - Paid by ${expense.paidBy.name} on ${new Date(
                              expense.date
                            ).toLocaleDateString()}`}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                {expenses.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No expenses yet.
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Group; 