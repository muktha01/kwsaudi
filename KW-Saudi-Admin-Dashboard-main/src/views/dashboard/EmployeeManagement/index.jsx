import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  TextField,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { employeeService } from "api/employee";

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 = Jeddah, 1 = Jasmin, 2 = Regional Team
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Dialog states
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form states
  const [editForm, setEditForm] = useState({
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    active: true,
    profileImage: null,
  });

  const [createForm, setCreateForm] = useState({
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    active: true,
    profileImage: null,
  });

  // Get team name based on active tab
  const getTeamName = () => {
    const teams = ["Jeddah", "Jasmin", "Regional Team"];
    return teams[activeTab];
  };

  // Fetch employees when tab changes
  useEffect(() => {
    fetchEmployees();
  }, [activeTab]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const team = getTeamName();
      const response = await employeeService.getEmployeesByTeam(team);
      setEmployees(response?.employees || response || []);
    } catch (error) {
      showMessage("error", "Failed to fetch employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setOpenSnackbar(true);
  };

  // ===== CREATE EMPLOYEE =====
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateImageChange = (e) => {
    setCreateForm((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleToggleCreateActive = () => {
    setCreateForm((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleCreateEmployee = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", createForm.name);
      formData.append("jobTitle", createForm.jobTitle);
      formData.append("email", createForm.email);
      formData.append("phone", createForm.phone);
      formData.append("active", createForm.active);
      formData.append("team", getTeamName());
      if (createForm.profileImage) {
        formData.append("profileImage", createForm.profileImage);
      }

      await employeeService.createEmployee(formData);
      showMessage("success", "Employee created successfully");
      handleCloseCreateDialog();
      fetchEmployees();
    } catch (error) {
      showMessage("error", "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setCreateForm({
      name: "",
      jobTitle: "",
      email: "",
      phone: "",
      active: true,
      profileImage: null,
    });
    setCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialog(false);
    setCreateForm({
      name: "",
      jobTitle: "",
      email: "",
      phone: "",
      active: true,
      profileImage: null,
    });
  };

  // ===== VIEW EMPLOYEE =====
  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialog(false);
    setSelectedEmployee(null);
  };

  // ===== EDIT EMPLOYEE =====
  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setEditForm({
      name: emp.name || "",
      jobTitle: emp.jobTitle || "",
      email: emp.email || "",
      phone: emp.phone || "",
      active: emp.active ?? true,
      profileImage: null,
    });
    setEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialog(false);
    setSelectedEmployee(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    setEditForm((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleToggleEditActive = () => {
    setEditForm((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("jobTitle", editForm.jobTitle);
      formData.append("email", editForm.email);
      formData.append("phone", editForm.phone);
      formData.append("active", editForm.active);
      if (editForm.profileImage) {
        formData.append("profileImage", editForm.profileImage);
      }

      await employeeService.updateEmployee(selectedEmployee._id, formData);
      showMessage("success", "Employee updated successfully");
      handleCloseEditDialog();
      fetchEmployees();
    } catch (error) {
      showMessage("error", "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  // ===== DELETE EMPLOYEE =====
  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      setLoading(true);
      await employeeService.deleteEmployee(employeeId);
      showMessage("success", "Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      showMessage("error", "Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} centered sx={{ mb: 2 }}>
            <Tab label="Jeddah Employees" />
            <Tab label="Jasmin Employees" />
            <Tab label="Regional Team" />
          </Tabs>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {employees.length} employees ({getTeamName()})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
              sx={{ minWidth: 200 }}
            >
              Add New Employee
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Profile</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Job Title</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    {/* <TableCell>Status</TableCell> */}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.length > 0 ? (
                    employees.map((emp) => (
                      <TableRow key={emp._id}>
                        <TableCell>
                          <Avatar
                            src={emp.profileImage ? (emp.profileImage.startsWith('http') ? emp.profileImage : `http://localhost:5001/${emp.profileImage}`) : ""}
                            alt={emp.name}
                          >
                            {emp.name?.charAt(0)}
                          </Avatar>
                        </TableCell>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.jobTitle}</TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{emp.phone}</TableCell>
                        {/* <TableCell>
                          <Chip
                            label={emp.active ? "Active" : "Inactive"}
                            color={emp.active ? "success" : "default"}
                            size="small"
                          />
                        </TableCell> */}
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="View">
                              <IconButton onClick={() => handleView(emp)} color="info">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleEdit(emp)} color="primary">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => handleDelete(emp._id)} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No employees found for {getTeamName()}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Employee Dialog */}
      <Dialog open={createDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New {getTeamName()} Employee
          <IconButton
            onClick={handleCloseCreateDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={createForm.jobTitle}
                  onChange={handleCreateChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={createForm.email}
                  onChange={handleCreateChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={createForm.phone}
                  onChange={handleCreateChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={createForm.active} 
                      onChange={handleToggleCreateActive} 
                      color="primary" 
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Profile Image
                  <input type="file" hidden accept="image/*" onChange={handleCreateImageChange} />
                </Button>
                {createForm.profileImage && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Selected: {createForm.profileImage.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateEmployee} 
            variant="contained" 
            disabled={loading || !createForm.name}
          >
            {loading ? <CircularProgress size={24} /> : "Create Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={editDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Employee
          <IconButton
            onClick={handleCloseEditDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={editForm.jobTitle}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={editForm.active} 
                      onChange={handleToggleEditActive} 
                      color="primary" 
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload New Profile Image
                  <input type="file" hidden accept="image/*" onChange={handleEditImageChange} />
                </Button>
                {editForm.profileImage && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Selected: {editForm.profileImage.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateEmployee} 
            variant="contained" 
            disabled={loading || !editForm.name}
          >
            {loading ? <CircularProgress size={24} /> : "Update Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={viewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Employee Details
          <IconButton
            onClick={handleCloseViewDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Avatar
                  src={selectedEmployee.profileImage ? `http://localhost:5001/${selectedEmployee.profileImage}` : ""}
                  alt={selectedEmployee.name}
                  sx={{ width: 100, height: 100, fontSize: '2rem' }}
                >
                  {selectedEmployee.name?.charAt(0)}
                </Avatar>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedEmployee.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Job Title:
                  </Typography>
                  <Typography variant="body1">
                    {selectedEmployee.jobTitle || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Team:
                  </Typography>
                  <Typography variant="body1">
                    {selectedEmployee.team}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography variant="body1">
                    {selectedEmployee.email || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone:
                  </Typography>
                  <Typography variant="body1">
                    {selectedEmployee.phone || 'Not specified'}
                  </Typography>
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip
                    label={selectedEmployee.active ? "Active" : "Inactive"}
                    color={selectedEmployee.active ? "success" : "default"}
                    size="small"
                  />
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedEmployee.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={message.type} sx={{ width: "100%" }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeManagement;