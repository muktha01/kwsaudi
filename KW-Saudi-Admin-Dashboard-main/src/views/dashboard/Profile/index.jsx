import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import { Phone, Person, Logout } from '@mui/icons-material';

export default function Profile() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/pages/login');
  };

  if (!admin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2.5rem',
                }}
              >
                {`${admin.firstName?.[0] || ''}${admin.lastName?.[0] || ''}`.toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {admin.firstName} {admin.lastName}
              </Typography>

              {admin.lastLogin && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Profile Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={admin.firstName}
                    disabled
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={admin.phoneNumber}
                    disabled
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Account Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant="contained"
                color="error"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ minWidth: 200 }}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
