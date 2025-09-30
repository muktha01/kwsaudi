import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Container,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Phone,
  Lock,
  Login as LoginIcon
} from '@mui/icons-material';

export default function Login() {
  const [form, setForm] = useState({ phoneNumber: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(form.phoneNumber, form.password);
      if (result.success) {
      navigate('/dashboard/default');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        
          //  background: 'linear-gradient(135deg, #667eea 0%)',
          py: 4
        }}
      >
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            width: '100%',
            maxWidth: 450,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              background: 'rgb(206, 32, 39, 255)',
              color: 'white',
              p: 4,
              textAlign: 'center'
            }}
          >
            <LoginIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Admin Login
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Welcome back! Please sign in to your account
            </Typography>
          </Box>

          {/* Form */}
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                {/* Phone Number Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="phoneNumber"
                    label="Phone Number"
                    value={form.phoneNumber}
        onChange={handleChange}
        required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Password Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
        name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
        value={form.password}
        onChange={handleChange}
        required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Error Alert */}
                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {error}
                    </Alert>
                  </Grid>
                )}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      // '&:hover': {
                      //   background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      // },
                      background: 'rgba(206, 32, 39, 255)',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <LoginIcon sx={{ mr: 1 }} />
                        Sign In
                      </>
                    )}
                  </Button>
                </Grid>

                {/* Register Link */}
                {/* <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Link
                        to="/pages/register"
                        style={{
                          color: '#667eea',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                        }}
                      >
                        Create one here
                      </Link>
                    </Typography>
                  </Box>
                </Grid> */}
              </Grid>
            </Box>
          </CardContent>
        </Paper>
      </Box>
    </Container>
  );
}
