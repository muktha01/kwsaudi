import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Avatar, Stack, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:5001/api/employee';

const emptyForm = {
  name: '',
  position: '',
  email: '',
  phone: '',
  profileImage: null
};

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [team, setTeam] = useState('Jeddah'); // default team
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);

  // Fetch employees by team
  const fetchEmployees = async (teamName) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/team/${teamName}`);
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(team);
  }, [team]);

  // Open modal
  const handleOpen = (emp = emptyForm) => {
    setForm({ ...emp, profileImage: null });
    setPreview(emp.profileImage ? `http://localhost:5001/${emp.profileImage}` : null);
    setEditId(emp._id || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(emptyForm);
    setEditId(null);
    setPreview(null);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files && files[0]) {
      setForm((prev) => ({ ...prev, profileImage: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Save (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    try {
      setLoading(true);
      if (editId) {
        await fetch(`${API_BASE_URL}/${editId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        await fetch(API_BASE_URL, {
          method: 'POST',
          body: formData
        });
      }
      await fetchEmployees(team);
      handleClose();
    } catch (err) {
      setError('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      setLoading(true);
      await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      await fetchEmployees(team);
    } catch (err) {
      setError('Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto', bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">Employee Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Employee
        </Button>
      </Stack>

      {/* Team Selector */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Team</InputLabel>
        <Select value={team} onChange={(e) => setTeam(e.target.value)} label="Team">
          <MenuItem value="Jeddah">Jeddah</MenuItem>
          <MenuItem value="Jasmin">Jasmin</MenuItem>
        </Select>
      </FormControl>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Profile</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No employees found.</TableCell>
                  </TableRow>
                ) : employees.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      {item.profileImage ? (
                        <Avatar src={`http://localhost:5001/${item.profileImage}`} alt={item.name} />
                      ) : (
                        <Avatar>{item.name?.[0]}</Avatar>
                      )}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpen(item)}><Edit /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(item._id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Add / Edit Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <DialogContent>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={preview} sx={{ width: 56, height: 56 }} />
                <Button variant="outlined" component="label">
                  Upload Image
                  <input type="file" name="profileImage" accept="image/*" hidden onChange={handleChange} />
                </Button>
              </Box>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
              <TextField label="Position" name="position" value={form.position} onChange={handleChange} fullWidth required />
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required />
              <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth required />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">{editId ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EmployeeManagement;
