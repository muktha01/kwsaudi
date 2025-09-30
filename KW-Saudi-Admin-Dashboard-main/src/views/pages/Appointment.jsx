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
  Alert,
  Snackbar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

const Appointment = () => {
  const [agents, setAgents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // CRUD state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Form state
  const [formData, setFormData] = useState({
    agentName: '',
    yourName: '',
    phone: '',
    email: '',
    city: '',
    purpose: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'pending',
    termsAccepted: false,
    notes: ''
  });

  useEffect(() => {
    console.log('Appointment component mounted, fetching agents...');
    fetchAgents();
    fetchAppointments();
  }, []);

  const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5001/api/leads');
        const data = await res.json();
      
      if (Array.isArray(data)) {
        // Filter for real agents only (isAgent: true)
        const realAgents = data.filter(item => item.isAgent === true);
        setAgents(realAgents);
        console.log(`Found ${realAgents.length} real agents`);
      } else {
        console.log('API Response:', data);
        setError('Failed to fetch agent data - unexpected format');
      }
      } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to fetch agent data');
      } finally {
        setLoading(false);
      }
    };

  const fetchAppointments = async () => {
    try {
      // Fetch appointments from the leads API
      const res = await fetch('http://localhost:5001/api/leads');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Filter for appointment submissions (formType === 'appointment' and isAgent !== true)
        const appointmentSubmissions = data.filter(item => 
          item.formType === 'appointment' && item.isAgent !== true
        );
        setAppointments(appointmentSubmissions);
        console.log(`Found ${appointmentSubmissions.length} appointment submissions`);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  // CRUD Functions
  const handleCreate = async () => {
    try {
      // Validate required fields
      if (!formData.agentName || !formData.yourName || !formData.phone || 
          !formData.email || !formData.city || !formData.purpose || 
          !formData.appointmentDate || !formData.appointmentTime || !formData.termsAccepted) {
        setSnackbar({ open: true, message: 'Please fill in all required fields and accept terms', severity: 'error' });
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
          formType: 'appointment',
          fullName: formData.yourName,
          mobileNumber: formData.phone
        }),
      });

      const result = await res.json();
      
      if (result.success) {
        setSnackbar({ open: true, message: 'Appointment created successfully!', severity: 'success' });
        setCreateDialogOpen(false);
        resetForm();
        
        // Refresh data to show new appointment
        fetchAppointments();
      } else {
        setSnackbar({ open: true, message: result.message || 'Failed to create appointment', severity: 'error' });
      }
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      setSnackbar({ open: true, message: 'Error creating appointment', severity: 'error' });
    }
  };

  const handleUpdate = async () => {
    try {
      // Validate required fields
      if (!formData.agentName || !formData.yourName || !formData.phone || 
          !formData.email || !formData.city || !formData.purpose || 
          !formData.appointmentDate || !formData.appointmentTime || !formData.termsAccepted) {
        setSnackbar({ open: true, message: 'Please fill in all required fields and accept terms', severity: 'error' });
        return;
      }

      // Update via API
      const res = await fetch(`http://localhost:5001/api/leads/${selectedAppointment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'appointment',
          fullName: formData.yourName,
          mobileNumber: formData.phone
        }),
      });

      const result = await res.json();
      
      if (result.success) {
        setSnackbar({ open: true, message: 'Appointment updated successfully!', severity: 'success' });
        setEditDialogOpen(false);
        setSelectedAppointment(null);
        resetForm();
        
        // Refresh data to show updated appointment
        fetchAppointments();
      } else {
        setSnackbar({ open: true, message: result.message || 'Failed to update appointment', severity: 'error' });
      }
      
    } catch (error) {
      console.error('Error updating appointment:', error);
      setSnackbar({ open: true, message: 'Error updating appointment', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      // Delete via API
      const res = await fetch(`http://localhost:5001/api/leads/${selectedAppointment._id}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      
      if (result.success) {
        setSnackbar({ open: true, message: 'Appointment deleted successfully!', severity: 'success' });
        setDeleteDialogOpen(false);
        setSelectedAppointment(null);
        
        // Refresh data to show updated list
    fetchAppointments();
      } else {
        setSnackbar({ open: true, message: result.message || 'Failed to delete appointment', severity: 'error' });
      }
      
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setSnackbar({ open: true, message: 'Error deleting appointment', severity: 'error' });
    }
  };

  // Dialog Functions
  const openCreateDialog = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const openEditDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      agentName: appointment.agentName || '',
      yourName: appointment.yourName || '',
      phone: appointment.phone || '',
      email: appointment.email || '',
      city: appointment.city || '',
      purpose: appointment.purpose || '',
      appointmentDate: appointment.appointmentDate || '',
      appointmentTime: appointment.appointmentTime || '',
      status: appointment.status || 'pending',
      termsAccepted: appointment.termsAccepted || false,
      notes: appointment.notes || ''
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

  const openViewDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      agentName: '',
      yourName: '',
      phone: '',
      email: '',
      city: '',
      purpose: '',
      appointmentDate: '',
      appointmentTime: '',
      status: 'pending',
      termsAccepted: false,
      notes: ''
    });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
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
        Appointment Management
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
                Available Agents for Appointments
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreateDialog}
                sx={{ px: 3, py: 1.5 }}
              >
                Create New Appointment
              </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total agents loaded: {agents.length}
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
                    <TableCell>Actions</TableCell>
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
                          {agent.educationStatus && (
                            <Typography variant="caption" color="text.secondary">
                              {agent.educationStatus}
                            </Typography>
                          )}
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
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ScheduleIcon />}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, agentName: agent.fullName || `${agent.firstName || ''} ${agent.lastName || ''}` }));
                            openCreateDialog();
                          }}
                          sx={{ minWidth: '120px' }}
                        >
                          Book Appointment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Existing Appointments Section */}
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Existing Appointments ({appointments.length})
            </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Agent Name</TableCell>
                  <TableCell>Your Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Purpose</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={9} align="center">No appointments found.</TableCell>
                  </TableRow>
                  ) : appointments.map((appointment, idx) => (
                    <TableRow key={appointment._id || idx}>
                      <TableCell>{appointment.agentName || '-'}</TableCell>
                      <TableCell>{appointment.yourName || '-'}</TableCell>
                      <TableCell>{appointment.phone || '-'}</TableCell>
                      <TableCell>{appointment.email || '-'}</TableCell>
                      <TableCell>{appointment.city || '-'}</TableCell>
                      <TableCell>{appointment.purpose || '-'}</TableCell>
                      <TableCell>
                        {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : '-'}
                        <br />
                        {appointment.appointmentTime || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => openViewDialog(appointment)}
                              color="info"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Appointment">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(appointment)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Appointment">
                            <IconButton
                              size="small"
                              onClick={() => openDeleteDialog(appointment)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={createDialogOpen || editDialogOpen} onClose={() => { setCreateDialogOpen(false); setEditDialogOpen(false); }} maxWidth="md" fullWidth>
        <DialogTitle>
          {createDialogOpen ? 'Create New Appointment' : 'Edit Appointment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Agent Name"
                value={formData.agentName}
                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Your Name"
                value={formData.yourName}
                onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Purpose of Appointment"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                fullWidth
                required
                placeholder="e.g., Property Viewing, Consultation, etc."
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Appointment Date"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Appointment Time"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                fullWidth
                required
                placeholder="e.g., 10:00 AM"
              />
            </Box>
            {editDialogOpen && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            )}
            <TextField
              label="Additional Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Any specific requirements or questions..."
            />
            <FormControl fullWidth>
              <InputLabel>Terms & Conditions</InputLabel>
              <Select
                value={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.value })}
                label="Terms & Conditions"
              >
                <MenuItem value={true}>I accept the terms and conditions</MenuItem>
                <MenuItem value={false}>I do not accept</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateDialogOpen(false); setEditDialogOpen(false); }}>Cancel</Button>
          <Button 
            onClick={createDialogOpen ? handleCreate : handleUpdate} 
            variant="contained" 
            color="primary"
          >
            {createDialogOpen ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Appointment Details
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography><strong>Agent Name:</strong> {selectedAppointment.agentName}</Typography>
                <Typography><strong>Your Name:</strong> {selectedAppointment.yourName}</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography><strong>Phone:</strong> {selectedAppointment.phone}</Typography>
                <Typography><strong>Email:</strong> {selectedAppointment.email}</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography><strong>City:</strong> {selectedAppointment.city}</Typography>
                <Typography><strong>Purpose:</strong> {selectedAppointment.purpose}</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography><strong>Date:</strong> {selectedAppointment.appointmentDate ? new Date(selectedAppointment.appointmentDate).toLocaleDateString() : '-'}</Typography>
                <Typography><strong>Time:</strong> {selectedAppointment.appointmentTime}</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography><strong>Status:</strong> 
                  <Chip 
                    label={selectedAppointment.status} 
                    color={getStatusColor(selectedAppointment.status)} 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography><strong>Terms Accepted:</strong> 
                  <Chip 
                    label={selectedAppointment.termsAccepted ? 'Yes' : 'No'} 
                    color={selectedAppointment.termsAccepted ? 'success' : 'error'} 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
              {selectedAppointment.notes && (
                <Typography><strong>Notes:</strong> {selectedAppointment.notes}</Typography>
              )}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography><strong>Created:</strong> {selectedAppointment.createdAt ? new Date(selectedAppointment.createdAt).toLocaleString() : '-'}</Typography>
                <Typography><strong>Updated:</strong> {selectedAppointment.updatedAt ? new Date(selectedAppointment.updatedAt).toLocaleString() : '-'}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this appointment? This action cannot be undone.
          </Typography>
          {selectedAppointment && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Appointment:</strong> {selectedAppointment.yourName} with {selectedAppointment.agentName}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {selectedAppointment.appointmentDate} at {selectedAppointment.appointmentTime}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
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

export default Appointment; 