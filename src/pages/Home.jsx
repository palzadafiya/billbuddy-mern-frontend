import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const FeatureCard = ({ icon, title, description }) => (
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
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        color: 'primary.main',
      }}>
        {icon}
        <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const Home = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pt: 8,
      pb: 8,
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Split Bills with Friends, Made Simple
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              BillBuddy helps you track shared expenses and settle up with friends. No more awkward conversations about money!
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              {user ? (
                <Button
                  component={RouterLink}
                  to="/groups"
                  variant="contained"
                  size="large"
                  sx={{ 
                    background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #34495e 30%, #2980b9 90%)',
                    },
                  }}
                >
                  Go to Groups
                </Button>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{ 
                      background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #34495e 30%, #2980b9 90%)',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="large"
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
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://i.imgur.com/HGipXjF.png"
              alt="BillBuddy Hero"
              sx={{
                width: '100%',
                height: 'auto',
                maxWidth: 600,
              }}
            />
          </Grid>
        </Grid>

        {/* Features Section */}
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Why Choose BillBuddy?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<GroupIcon sx={{ fontSize: 40 }} />}
              title="Group Management"
              description="Create and manage groups easily. Add members, track expenses, and settle up with friends."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<MoneyIcon sx={{ fontSize: 40 }} />}
              title="Expense Tracking"
              description="Track all your shared expenses in one place. Split bills fairly and keep everyone in the loop."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<NotificationsIcon sx={{ fontSize: 40 }} />}
              title="Smart Notifications"
              description="Get notified when bills are due or when you need to settle up with friends."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<SpeedIcon sx={{ fontSize: 40 }} />}
              title="Quick Settlements"
              description="Settle up with friends in seconds. No more complicated calculations or spreadsheets."
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 