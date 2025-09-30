'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [newLink, setNewLink] = useState({ name: "", url: "" });

  // Function to fetch links from backend
  const fetchLinks = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/links");
      setLinks(res.data || []);
      console.log("Links loaded from backend:", res.data);
      return true;
    } catch (err) {
      console.error("Backend not running:", err);
      setLinks([]);
      return false;
    }
  };

  // Load links from backend
  useEffect(() => {
    fetchLinks();
  }, []);

  // Save updated link
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/links/${selectedLink._id}`,
        selectedLink
      );
      
      console.log("Link updated successfully in backend");
      
      // Refetch all links from backend to ensure consistency
      await fetchLinks();
      
      handleClose();
    } catch (err) {
      console.error("Error updating link in backend:", err);
      alert("Error updating link. Please try again.");
      handleClose();
    }
  };

  const handleEditClick = (link) => {
    setSelectedLink({ ...link });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLink(null);
  };

  const handleAddClick = () => {
    setNewLink({ name: "", url: "" });
    setAddOpen(true);
  };

  const handleAddClose = () => {
    setAddOpen(false);
    setNewLink({ name: "", url: "" });
  };

  const handleAddSave = async () => {
    try {
      if (!newLink.name || !newLink.url) {
        alert("Please fill in both name and URL");
        return;
      }

      const res = await axios.post("http://localhost:5001/api/links", newLink);
      
      console.log("Link added successfully:", res.data);
      
      // Refetch all links from backend
      await fetchLinks();
      
      handleAddClose();
    } catch (err) {
      console.error("Error adding link:", err);
      alert("Error adding link. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Manage Links
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleAddClick}
          sx={{ bgcolor: 'primary.main' }}
        >
          Add New Link
        </Button>
      </Box>

      {links.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No links found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start by adding your first link
          </Typography>
          <Button variant="outlined" onClick={handleAddClick}>
            Add Your First Link
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>URL</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link._id}>
                  <TableCell>{link.name}</TableCell>
                  <TableCell>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.url}
                    </a>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEditClick(link)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Link</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={selectedLink?.name || ""}
            onChange={(e) =>
              setSelectedLink({ ...selectedLink, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="URL"
            fullWidth
            value={selectedLink?.url || ""}
            onChange={(e) =>
              setSelectedLink({ ...selectedLink, url: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Link Dialog */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add New Link</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newLink.name}
            onChange={(e) =>
              setNewLink({ ...newLink, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="URL"
            fullWidth
            value={newLink.url}
            onChange={(e) =>
              setNewLink({ ...newLink, url: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSave}>
            Add Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
