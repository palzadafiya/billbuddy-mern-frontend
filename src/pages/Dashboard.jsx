import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import {
  Group as GroupIcon,
  Add as AddIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, expensesRes] = await Promise.all([
          axios.get('/api/groups'),
          axios.get('/api/expenses/recent'),
        ]);
        setGroups(groupsRes.data);
        setRecentExpenses(expensesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Groups Section */}
        <Grid item xs={12} md={6}>
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
                <Typography variant="h6" component="div">
                  Your Groups
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={RouterLink}
                  to="/create-group"
                  sx={{
                    textWrap: 'nowrap',
                  }}
                >
                  Create Group
                </Button>
              </Box>
              <List>
                {groups.map((group) => (
                  <React.Fragment key={group._id}>
                    <ListItem
                      button
                      component={RouterLink}
                      to={`/group/${group._id}`}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <GroupIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={group.name}
                        secondary={`${group.members.length} members`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                {groups.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No groups yet. Create one to get started!
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Expenses Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Recent Expenses
              </Typography>
              <List>
                {recentExpenses.map((expense) => (
                  <React.Fragment key={expense._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <MoneyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={expense.description}
                        secondary={`Rs. ${expense.amount} - ${new Date(
                          expense.date
                        ).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                {recentExpenses.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No recent expenses.
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

export default Dashboard; 