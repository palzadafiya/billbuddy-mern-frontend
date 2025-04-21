import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const AddExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    splitBetween: [],
  });

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        if (!id) {
          setError('Invalid group ID');
          setLoading(false);
          return;
        }

        const res = await axios.get(`/api/groups/${id}`);
        setGroup(res.data);
        setFormData(prev => ({
          ...prev,
          splitBetween: res.data.members.map(member => member.user._id),
        }));
      } catch (err) {
        console.error('Error fetching group:', err);
        setError(err.response?.data?.message || 'Failed to fetch group details');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSplitChange = (e) => {
    setFormData(prev => ({
      ...prev,
      splitBetween: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!id) {
        setError('Invalid group ID');
        return;
      }

      await axios.post(`/api/expenses`, {
        ...formData,
        group: id,
        splitAmong: formData.splitBetween,
      });
      navigate(`/group/${id}`);
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err.response?.data?.message || 'Failed to add expense');
    }
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
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Add New Expense
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Split Between</InputLabel>
                <Select
                  multiple
                  value={formData.splitBetween}
                  onChange={handleSplitChange}
                >
                  {group.members.map((member, index) => (
                    <MenuItem key={`${member.user._id}-${index}`} value={member.user._id}>
                      {member.user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Add Expense
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default AddExpense; 