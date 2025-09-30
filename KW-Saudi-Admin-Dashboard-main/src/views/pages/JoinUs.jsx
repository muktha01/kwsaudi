import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const JoinUs = () => {
  const [agents, setAgents] = useState([]);
  const [joinUsData, setJoinUsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    message: '',
    formType: 'join-us'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
      // Fetch all data from leads API
        const res = await fetch('http://localhost:5001/api/leads');
        const data = await res.json();
      
      if (Array.isArray(data)) {
        // Filter agents (real agents with isAgent: true)
        const realAgents = data.filter(item => item.isAgent === true);
        setAgents(realAgents);
        console.log(`Found ${realAgents.length} real agents`);
        
        // Filter join us submissions (formType === 'join-us' and isAgent !== true)
        const joinUsSubmissions = data.filter(item => 
          item.formType === 'join-us' && item.isAgent !== true
        );
        setJoinUsData(joinUsSubmissions);
        console.log(`Found ${joinUsSubmissions.length} join us submissions`);
      } else {
        console.log('API Response:', data);
        setError('Failed to fetch data - unexpected format');
      }
      
      } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.fullName || !formData.mobileNumber || !formData.email || !formData.city) {
        setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
        return;
      }

      // Submit to real API
      const res = await fetch('http://localhost:5001/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'join-us'
        }),
      });

      const result = await res.json();
      
      if (result.success) {
        setSnackbar({ open: true, message: 'Join Us form submitted successfully!', severity: 'success' });
        setFormDialogOpen(false);
        resetForm();
        
        // Refresh data to show new submission
        fetchData();
      } else {
        setSnackbar({ open: true, message: result.message || 'Failed to submit form', severity: 'error' });
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({ open: true, message: 'Error submitting form', severity: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      email: '',
      city: '',
      message: '',
      formType: 'join-us'
    });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getFormTypeColor = (formType) => {
    switch (formType) {
      case 'jasmin':
        return 'primary';
      case 'jeddah':
        return 'secondary';
      case 'franchise':
        return 'success';
      case 'contact-us':
        return 'info';
      default:
        return 'default';
    }
  };

  const getFormTypeLabel = (formType) => {
    switch (formType) {
      case 'jasmin':
        return 'Jasmin';
      case 'jeddah':
        return 'Jeddah';
      case 'franchise':
        return 'Franchise';
      case 'contact-us':
        return 'Contact Us';
      default:
        return 'General';
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto', bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" mb={2} color="text.primary">
        Join Us Management
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {/* Available Agents Section */}
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Available Agents to Join
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFormDialogOpen(true)}
                sx={{ px: 3, py: 1.5 }}
              >
                Submit Join Us Form
              </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total agents available: {agents.length}
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Agent Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Education</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No agents found.</TableCell>
                    </TableRow>
                  ) : agents.map((agent, idx) => (
                    <TableRow key={agent._id || idx}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {agent.fullName || `${agent.firstName || ''} ${agent.lastName || ''}`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{agent.email || '-'}</TableCell>
                      <TableCell>{agent.mobileNumber || '-'}</TableCell>
                      <TableCell>{agent.city || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={getFormTypeLabel(agent.formType)}
                          color={getFormTypeColor(agent.formType)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{agent.companyName || '-'}</TableCell>
                      <TableCell>{agent.educationStatus || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Join Us Submissions Section */}
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Join Us Form Submissions ({joinUsData.length})
            </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Message</TableCell>
                    <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {joinUsData.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={7} align="center">No join us submissions found.</TableCell>
                  </TableRow>
                ) : joinUsData.map((item, idx) => (
                  <TableRow key={item._id || idx}>
                    <TableCell>{item.fullName || '-'}</TableCell>
                    <TableCell>{item.mobileNumber || '-'}</TableCell>
                    <TableCell>{item.email || '-'}</TableCell>
                    <TableCell>{item.city || '-'}</TableCell>
                    <TableCell>{item.message || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          color={item.status === 'pending' ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        </>
      )}

      {/* Join Us Form Dialog */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit Join Us Form</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  fullWidth
                  required
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  fullWidth
                  required
                />
              </Box>
              <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                fullWidth
                multiline
                rows={4}
                placeholder="Tell us why you want to join our team..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JoinUs; 