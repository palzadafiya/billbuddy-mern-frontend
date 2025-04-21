import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [],
  });
  const [memberEmail, setMemberEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddMember = () => {
    if (!memberEmail) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(memberEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.members.includes(memberEmail)) {
      setError('This member is already added');
      return;
    }

    setFormData({
      ...formData,
      members: [...formData.members, memberEmail],
    });
    setMemberEmail('');
    setError('');
  };

  const handleRemoveMember = (email) => {
    setFormData({
      ...formData,
      members: formData.members.filter((m) => m !== email),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('Group name is required');
      setLoading(false);
      return;
    }

    if (formData.members.length === 0) {
      setError('Please add at least one member');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/groups', {
        ...formData,
        members: formData.members.map(email => ({ email })),
      });
      navigate(`/group/${res.data._id}`);
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Create New Group
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Group Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Member Email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                />
                <IconButton onClick={handleAddMember} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.members.map((email) => (
                  <Chip
                    key={email}
                    label={email}
                    onDelete={() => handleRemoveMember(email)}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Group'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default CreateGroup; 