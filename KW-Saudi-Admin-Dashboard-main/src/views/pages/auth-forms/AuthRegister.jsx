import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| JWT - REGISTER ||=========================== //

export default function AuthRegister() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    // Validation
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    if (!checked) {
      setError('Please agree to the terms and conditions');
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setShowError(true);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setShowError(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register({
        firstName,
        lastName,
        email,
        phoneNumber,
        password
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
        setShowError(true);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Grid container direction="column" spacing={2} sx={{ justifyContent: 'center' }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }} size={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 0, sm: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            name="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ ...theme.typography.customInput }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            name="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ ...theme.typography.customInput }}
          />
        </Grid>
      </Grid>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
        <OutlinedInput 
          id="outlined-adornment-email-register" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          name="email" 
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-phone-register">Phone Number</InputLabel>
        <OutlinedInput 
          id="outlined-adornment-phone-register" 
          type="text" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)}
          name="phoneNumber" 
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-register"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          label="Password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-confirm-password-register">Confirm Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-confirm-password-register"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          name="confirmPassword"
          label="Confirm Password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
            label={
              <Typography variant="subtitle1">
                Agree with &nbsp;
                <Typography variant="subtitle1" component={Link} to="#">
                  Terms & Condition.
                </Typography>
              </Typography>
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button 
            disableElevation 
            fullWidth 
            size="large" 
            type="submit" 
            variant="contained" 
            color="secondary"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Signing Up...' : 'Sign up'}
          </Button>
        </AnimateButton>
      </Box>
    </>
  );
}
