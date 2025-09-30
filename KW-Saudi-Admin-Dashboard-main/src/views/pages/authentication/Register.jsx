import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
 
  Phone,
  Lock,
  PersonAdd
} from '@mui/icons-material';

export default function Register() {
  const [form, setForm] = useState({ 
    firstName: '', 
    
    phoneNumber: '', 
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Validation
    if (!form.firstName ||  !form.phoneNumber || !form.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const { firstName, phoneNumber, password, role } = form;
      const result = await register({ firstName, phoneNumber, password, role });
      if (result.success) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard/users'), 1500);
      } else {
        // Show backend message, but update for clarity if needed
        if (result.message === 'Only admin or superadmin can create admin/subadmin accounts') {
          setError('Only admin or superadmin can create admin/subadmin accounts');
        } else {
          setError(result.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // background: 'linear-gradient(135deg, #667eea 0%)',
          // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4
        }}
      >
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            width: '100%',
            maxWidth: 600,
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
            <PersonAdd sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Admin Registration
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Create your admin account to access the dashboard
            </Typography>
          </Box>

          {/* Form */}
          <Box sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                {/* First Name Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="firstName"
                    label="Name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
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
                <Grid item xs={12} sm={6}>
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
                            onClick={() => setShowPassword(!showPassword)}
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

                {/* Confirm Password Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                {/* Role Selector */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={form.role}
                      label="Role"
                      onChange={handleChange}
                    >
                      <MenuItem value="user">User</MenuItem>
                      {/* <MenuItem value="subadmin">SubAdmin</MenuItem> */}
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Error Alert */}
                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {error}
                    </Alert>
                  </Grid>
                )}

                {/* Success Alert */}
                {success && (
                  <Grid item xs={12}>
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      {success}
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
                      background: 'rgb(206, 32, 39, 255)',
                      '&:hover': {
                        // background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        background: 'rgb(206, 32, 39, 255)',
                      },
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <PersonAdd sx={{ mr: 1 }} />
                        Create Account
                      </>
                    )}
                  </Button>
                </Grid>

                {/* Login Link */}
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Link
                        to="/pages/login"
                        style={{
                          color: 'rgb(206, 32, 39, 255)',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
