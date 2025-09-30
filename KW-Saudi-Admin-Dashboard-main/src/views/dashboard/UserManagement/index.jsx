import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon, Person as PersonIcon } from '@mui/icons-material';
import { adminService } from 'api/admin';
import { Link as RouterLink } from 'react-router-dom';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    firstName: '',
  
 
    password: '',
    confirmPassword: '',
    role: 'user',
    phoneNumber: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response.admins || []);
    } catch (error) {
      showMessage('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setOpenSnackbar(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showMessage('error', 'Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      
     
      password: '',
      confirmPassword: '',
      role: 'user',
      phoneNumber: ''
    });
    setImagePreview(null);
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || '',
     
    
      password: '',
      confirmPassword: '',
      role: user.role,
      phoneNumber: user.phoneNumber || ''
    });
    setImagePreview(user.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5001/${user.profileImage.replace(/^\\?/, '')}`) : null);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = { ...formData };
      if (!isEditing && !dataToSend.password) {
        showMessage('error', 'Password is required for new users');
        setLoading(false);
        return;
      }
      if (isEditing && !dataToSend.password) {
        delete dataToSend.password;
      }
      if (isEditing) {
        await adminService.updateUser(selectedUser._id, dataToSend);
        showMessage('success', 'User updated successfully!');
      } else {
        await adminService.register(dataToSend);
        showMessage('success', 'User created successfully!');
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      showMessage('error', error.error || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      setLoading(true);
      await adminService.deleteUser(userId);
      showMessage('success', 'User deleted successfully');
      fetchUsers();
      if (selectedUser?._id === userId) {
        resetForm();
      }
    } catch (error) {
      showMessage('error', 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (user) => {
    setSelectedUserDetails(user);
    setViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialog(false);
    setSelectedUserDetails(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          component={RouterLink}
          to="/pages/register"
          variant="contained"
          color="primary"
        >
          Register New User
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Users
          </Typography>
          <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        {/* Removed Avatar column */}
        <TableCell>Name</TableCell>
       
        <TableCell>Role</TableCell>
        {/* <TableCell>Status</TableCell> */}
        <TableCell>Phone</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {users.map((user) => (
        <TableRow key={user._id}>
          {/* Removed Avatar cell */}
          <TableCell>{user.firstName}</TableCell>
         
          <TableCell>
            <Chip
              label={user.role}
              color={user.role === 'admin' ? 'primary' : 'default'}
              size="small"
            />
          </TableCell>
          {/* <TableCell>
            <Chip label={user.status} color={user.status === 'active' ? 'success' : 'default'} size="small" />
          </TableCell> */}
          <TableCell>{user.phoneNumber}</TableCell>
          <TableCell>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDelete(user._id)}
                disabled={loading}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

        </CardContent>
      </Card>
      <Dialog open={viewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUserDetails && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                {selectedUserDetails.profileImage ? (
                <Avatar
                    src={selectedUserDetails.profileImage.startsWith('http') ? selectedUserDetails.profileImage : `http://localhost:5001/${selectedUserDetails.profileImage.replace(/^\\?/, '')}`}
                  alt={selectedUserDetails.name}
                    sx={{ width: 80, height: 80, margin: 'auto' }}
                  />
                ) : (
                  <Avatar sx={{ width: 80, height: 80, margin: 'auto' }}>
                    <PersonIcon />
                </Avatar>
                )}
              </Box>
              <Typography variant="h6" align="center">{selectedUserDetails.name}</Typography>
        
              <Typography variant="body2" align="center">Role: {selectedUserDetails.role}</Typography>
              <Typography variant="body2" align="center">Status: {selectedUserDetails.status}</Typography>
              <Typography variant="body2" align="center">Phone: {selectedUserDetails.phone}</Typography>
              
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={message.type}
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;