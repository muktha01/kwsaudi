import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Stack, 
  Button, 
  Paper, 
  TextField, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Leads() {
  const [activePage, setActivePage] = useState('contactus');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all'); // all | today | week | month | year
  
  // CRUD state

  
  // Download leads as Excel (all or filtered)
  const handleDownloadExcel = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5001/api/leads-export';
      const params = new URLSearchParams();
      
      // Add formType filter (except 'contactus' which is 'contact-us')
      let formType = activePage;
      if (formType === 'contactus') formType = 'contact-us';
      if (formType && formType !== 'all') {
        params.append('formType', formType);
      }
      
      // Add time filter
      if (timeFilter && timeFilter !== 'all') {
        params.append('range', timeFilter);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to download Excel');
      
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `leads_${formType}_${timeFilter}_${new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(a.href);
      
      setSnackbar({ open: true, message: 'Excel file downloaded successfully!', severity: 'success' });
    } catch (err) {
      console.error('Excel download error:', err);
      setSnackbar({ open: true, message: 'Excel download failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Form state for editing
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchLeads();
  }, [timeFilter]); // Add timeFilter dependency to re-fetch when filter changes

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const query = timeFilter === 'all' ? '' : `?range=${timeFilter}`;
      const res = await fetch(`http://localhost:5001/api/leads${query}`);
      const data = await res.json();
      // Backend returns { success: true, data: [...] }
      setLeads(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Server is filtering by date; no client filtering needed
  const isWithinFilter = () => true;

  // Handle lead update
  const handleUpdateLead = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/leads/${selectedLead._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setSnackbar({ open: true, message: 'Lead updated successfully!', severity: 'success' });
        setEditDialogOpen(false);
        fetchLeads(); // Refresh data
      } else {
        const errorData = await res.json();
        setSnackbar({ open: true, message: errorData.message || 'Failed to update lead', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error updating lead', severity: 'error' });
    }
  };

  // Handle lead deletion
  const handleDeleteLead = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/leads/${selectedLead._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSnackbar({ open: true, message: 'Lead deleted successfully!', severity: 'success' });
        setDeleteDialogOpen(false);
        fetchLeads(); // Refresh data
      } else {
        const errorData = await res.json();
        setSnackbar({ open: true, message: errorData.message || 'Failed to delete lead', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error deleting lead', severity: 'error' });
    }
  };

  // Open edit dialog
  const openEditDialog = (lead) => {
    setSelectedLead(lead);
    setEditFormData({
      fullName: lead.fullName || lead.fullname || '',
      mobileNumber: lead.mobileNumber || '',
      email: lead.email || '',
      city: lead.city || '',
      message: lead.message || '',
      address: lead.address || '',
      bedrooms: lead.bedrooms || '',
      property_type: lead.property_type || '',
      valuation_type: lead.valuation_type || '',
      dob: lead.dob || '',
      educationStatus: lead.educationStatus || '',
      promotionalConsent: lead.promotionalConsent || false,
      personalDataConsent: lead.personalDataConsent || false,
      enquiryType: lead.enquiryType || ''
    });
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (lead) => {
    setSelectedLead(lead);
    setDeleteDialogOpen(true);
  };

  // Filter leads by form type
  const getLeadsByType = (formType) => {
    return leads.filter(lead => lead.formType === formType && !lead.isAgent && isWithinFilter(lead.createdAt));
  };

  // Render table for each form type
  const renderTable = (formType, title) => {
    const filteredLeads = getLeadsByType(formType);
    
    if (filteredLeads.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No {title} leads found
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              {formType !== 'instant-valuation' && (
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              )}
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mobile</TableCell>
              {(formType === 'jasmin' || formType === 'jeddah' || formType === 'franchise' || formType === 'instant-valuation' || formType === 'join-us') && (
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
              )}
              {formType === 'instant-valuation' && (
                <>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bedrooms</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Property Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valuation Type</TableCell>
                </>
              )}
              {formType === 'franchise' && (
                <>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>DOB</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Education</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Consent</TableCell>
                </>
              )}
              {formType === 'contact-us' && (
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Enquiry Type</TableCell>
              )}
              {formType !== 'instant-valuation' && (
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Message</TableCell>
              )}
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead._id} hover>
              
                <TableCell>{lead.fullName || lead.fullname || 'N/A'}</TableCell>
                {formType !== 'instant-valuation' && (
                  <TableCell>{lead.email || 'N/A'}</TableCell>
                )}
                <TableCell>{lead.mobileNumber || 'N/A'}</TableCell>
                {(formType === 'jasmin' || formType === 'jeddah' || formType === 'franchise' || formType === 'instant-valuation' || formType === 'join-us') && (
                  <TableCell>{lead.city || 'N/A'}</TableCell>
                )}
                {formType === 'instant-valuation' && (
                  <>
                    <TableCell>{lead.bedrooms || 'N/A'}</TableCell>
                    <TableCell>{lead.property_type || 'N/A'}</TableCell>
                    <TableCell>{lead.valuation_type || 'N/A'}</TableCell>
                  </>
                )}
                {formType === 'franchise' && (
                  <>
                    <TableCell>{lead.dob ? new Date(lead.dob).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{lead.educationStatus || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`Promo: ${lead.promotionalConsent ? 'Yes' : 'No'}, Data: ${lead.personalDataConsent ? 'Yes' : 'No'}`}
                        size="small"
                        color={lead.promotionalConsent && lead.personalDataConsent ? 'success' : 'warning'}
                      />
                    </TableCell>
                  </>
                )}
                {formType === 'contact-us' && (
                  <TableCell>{lead.enquiryType || 'N/A'}</TableCell>
                )}
                {formType !== 'instant-valuation' && (
                  <TableCell>
                    <Tooltip title={lead.message}>
                      <Typography sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lead.message || 'N/A'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                <TableCell>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => {
                          setSelectedMessage(lead);
                          setMessageDialogOpen(true);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Lead">
                      <IconButton 
                        size="small" 
                        color="warning"
                        onClick={() => openEditDialog(lead)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Lead">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => openDeleteDialog(lead)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Leads Management
      </Typography>

      {/* Time filter - dropdown for cleaner UI */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          select
          size="small"
          label="Date Range"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ width: 240 }}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </TextField>
        <Button variant="contained" color="success" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </Stack>

      {/* Tab Navigation */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Button
          variant={activePage === 'contactus' ? 'contained' : 'outlined'}
          onClick={() => setActivePage('contactus')}
        >
          Contact Us
        </Button>
        <Button
          variant={activePage === 'jasmin' ? 'contained' : 'outlined'}
          onClick={() => setActivePage('jasmin')}
        >
          Jasmin
        </Button>
        <Button
          variant={activePage === 'jeddah' ? 'contained' : 'outlined'}
          onClick={() => setActivePage('jeddah')}
        >
          Jeddah
        </Button>
        <Button
          variant={activePage === 'franchise' ? 'contained' : 'outlined'}
          onClick={() => setActivePage('franchise')}
        >
          Franchise
        </Button>
        <Button
          variant={activePage === 'instant-valuation' ? 'contained' : 'outlined'}
          onClick={() => setActivePage('instant-valuation')}
        >
          Instant Valuation
        </Button>
        <Button
          variant={activePage === 'join-us' ? 'contained' : 'outlined'}
          onClick={() => setActivePage('join-us')}
        >
          Join Us
        </Button>
      </Stack>

      {/* Content based on active tab */}
      {activePage === 'contactus' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Contact Us </Typography>
          {renderTable('contact-us', 'Contact Us')}
        </Box>
      )}

      {activePage === 'jasmin' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Jasmin</Typography>
          {renderTable('jasmin', 'Jasmin')}
        </Box>
      )}

      {activePage === 'jeddah' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Jeddah</Typography>
          {renderTable('jeddah', 'Jeddah')}
        </Box>
      )}

      {activePage === 'franchise' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Franchise</Typography>
          {renderTable('franchise', 'Franchise')}
        </Box>
      )}

      {activePage === 'instant-valuation' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Instant Valuation</Typography>
          {renderTable('instant-valuation', 'Instant Valuation')}
        </Box>
      )}

      {activePage === 'join-us' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Join Us</Typography>
          {renderTable('join-us', 'Join Us')}
        </Box>
      )}

      {/* View Message Dialog */}
      <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Lead Details
          <IconButton
            aria-label="close"
            onClick={() => setMessageDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Message:</Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography>{selectedMessage.message || 'No message available'}</Typography>
              </Paper>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Lead Information:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                {Object.entries(selectedMessage).map(([key, value]) => {
                  if (key === '_id' || key === '__v' || key === 'message') return null;
                  if (typeof value === 'boolean') {
                    value = value ? 'Yes' : 'No';
                  } else if (key === 'createdAt' || key === 'updatedAt' || key === 'dob') {
                    value = value ? new Date(value).toLocaleString() : 'N/A';
                  }
                  return (
                    <Box key={key}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </Typography>
                      <Typography variant="body1">{value || 'N/A'}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Lead
          <IconButton
            aria-label="close"
            onClick={() => setEditDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            <TextField
              label="Full Name"
              value={editFormData.fullName || ''}
              onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Mobile Number"
              value={editFormData.mobileNumber || ''}
              onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="City"
              value={editFormData.city || ''}
              onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
              fullWidth
            />
            <TextField
              label="Message"
              value={editFormData.message || ''}
              onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            {selectedLead?.formType === 'instant-valuation' && (
              <>
                <TextField
                  label="Address"
                  value={editFormData.address || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Bedrooms"
                  value={editFormData.bedrooms || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, bedrooms: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Property Type"
                  value={editFormData.property_type || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, property_type: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Valuation Type"
                  value={editFormData.valuation_type || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, valuation_type: e.target.value })}
                  fullWidth
                />
              </>
            )}
            {selectedLead?.formType === 'franchise' && (
              <>
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={editFormData.dob ? editFormData.dob.split('T')[0] : ''}
                  onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Education Status"
                  value={editFormData.educationStatus || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, educationStatus: e.target.value })}
                  fullWidth
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateLead} variant="contained" color="primary">
            Update Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this lead? This action cannot be undone.
          </Typography>
          {selectedLead && (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              Lead: {selectedLead.fullName || selectedLead.fullname || 'Unknown'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteLead} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
