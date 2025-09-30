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
  Chip,
  Rating,
  Tabs,
  Tab,
  Pagination,
  FormControlLabel,
  Select as MuiSelect
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import { agentService } from 'api/agent';

const AgentManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalAgents, setTotalAgents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents(1, pageSize);
  }, []);

  const fetchAgents = async (page = currentPage, limit = pageSize) => {
    try {
      setLoading(true);
      let response;
      
      // Use different API endpoints based on active tab
      if (activeTab === 1) {
        // Jasmin tab - use specific org endpoint
        response = await agentService.getAgentsByOrgId('50449', page, limit);
      } else if (activeTab === 2) {
        // Jeddah tab - use specific org endpoint
        response = await agentService.getAgentsByOrgId('2414288', page, limit);
      } else {
        // All Users tab - use merged endpoint
        response = await agentService.getFilteredAgents(page, limit);
      }
      
      // The API returns { success: true, data: [...], total: number, page: number, count: number }
      setAgents(response.data || []);
      setTotalAgents(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / limit));
      setCurrentPage(response.page || 1);
    } catch (error) {
      showMessage('error', 'Failed to fetch agents');
      setAgents([]);
      setTotalAgents(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to first page when changing tabs
    // Fetch data for the new tab
    setTimeout(() => fetchAgents(1, pageSize), 0);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    fetchAgents(newPage, pageSize);
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = event.target.value;
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchAgents(1, newPageSize);
  };

  const getTabLabel = (index) => {
    switch (index) {
      case 0:
        return 'All Users';
      case 1:
        return 'Jasmin';
      case 2:
        return 'Jeddah';
      default:
        return 'All Users';
    }
  };

  const getFilteredAgents = () => {
    // Since we're now using different API endpoints for each tab,
    // we just return the agents directly as they're already filtered by the API
    return agents;
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setOpenSnackbar(true);
  };



  const handleDelete = async (agentId) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      setLoading(true);
      await agentService.deleteAgent(agentId);
      showMessage('success', 'Agent deleted successfully');
      fetchAgents(currentPage, pageSize);
    } catch (error) {
      showMessage('error', 'Failed to delete agent');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (agent) => {
    setSelectedAgentDetails(agent);
    setViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialog(false);
    setSelectedAgentDetails(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Agent Management
      </Typography>

      {/* Tabs for filtering agents */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered
            sx={{ mb: 2 }}
          >
            <Tab label="All Users" />
            <Tab label="Jasmin" />
            <Tab label="Jeddah" />
          </Tabs>
          <Typography variant="body2" color="text.secondary" align="center">
            Showing {getFilteredAgents().length} agents from {getTabLabel(activeTab)}
          </Typography>
        </CardContent>
      </Card>



      {/* Agents Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Agents
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Profile</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Market Center</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredAgents().map((agent) => (
                  <TableRow key={agent._id}>
                    <TableCell>
                      <Avatar
                        src={agent.photo || agent.profileImage}
                        alt={agent.fullName}
                      >
                        {agent.fullName?.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{agent.fullName}</TableCell>
                    <TableCell>{agent.marketCenter}</TableCell>
                    <TableCell>{agent.city}</TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={agent.active ? 'Active' : 'Inactive'}
                        color={agent.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton
                          onClick={() => handleView(agent)}
                          disabled={loading}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalAgents)} of {totalAgents} agents
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Page Size</InputLabel>
                <MuiSelect
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  label="Page Size"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </MuiSelect>
              </FormControl>
            </Box>
            
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              disabled={loading}
            />
          </Box>
        </CardContent>
      </Card>

      {/* View Agent Dialog */}
      <Dialog
        open={viewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Agent Details
        </DialogTitle>
        <DialogContent>
          {selectedAgentDetails && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={selectedAgentDetails.photo || selectedAgentDetails.profileImage}
                  alt={selectedAgentDetails.fullName}
                  sx={{ width: 80, height: 80, mr: 2 }}
                >
                  {selectedAgentDetails.fullName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedAgentDetails.fullName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedAgentDetails.marketCenter}
                  </Typography>
                  <Chip
                    label={selectedAgentDetails.active ? 'Active' : 'Inactive'}
                    color={selectedAgentDetails.active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedAgentDetails.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{selectedAgentDetails.phone}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">KW ID</Typography>
                  <Typography variant="body1">{selectedAgentDetails.kwId}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Market Center</Typography>
                  <Typography variant="body1">{selectedAgentDetails.marketCenter}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">City</Typography>
                  <Typography variant="body1">{selectedAgentDetails.city}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip
                    label={selectedAgentDetails.active ? 'Active' : 'Inactive'}
                    color={selectedAgentDetails.active ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Slug</Typography>
                  <Typography variant="body1">{selectedAgentDetails.slug}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Last Name</Typography>
                  <Typography variant="body1">{selectedAgentDetails.lastName}</Typography>
                  </Grid>
              </Grid>
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

export default AgentManagement; 