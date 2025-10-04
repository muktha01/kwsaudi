import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, CircularProgress, Stack
} from '@mui/material';
import { Add, Edit, Visibility } from "@mui/icons-material";

import { homePageService } from "../../../api/home.js";

const defaultForm = {
  pageName: 'Home',
  heading: '',
  subheading: '',
  backgroundImage: [], // Newly selected files
};

export default function HomePageManagement() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newPreview, setNewPreview] = useState([]);

  const [viewDialog, setViewDialog] = useState(false);
  const [viewPage, setViewPage] = useState(null);
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleDelete = async () => {
  try {
    await homePageService.delete(deleteId);
    await fetchPages();
    setDeleteDialog(false);
    setDeleteId(null);
  } catch (e) {
   
  }
};

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const currentCount = existingImages.length + newPreview.length;
    const availableSlots = 4 - currentCount;
    const filesToAdd = files.slice(0, availableSlots);

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    setNewPreview(prev => [...prev, ...newPreviews]);
    setForm(prev => ({
      ...prev,
      backgroundImage: [...(prev.backgroundImage || []), ...filesToAdd]
    }));

    e.target.value = '';
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await homePageService.getAll();
      setPages(data);
    } catch (e) {
     
      setPages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpen = (page = defaultForm) => {
    if (page && page._id) {
      setForm({
        pageName: page.pageName || 'Home',
        heading: page.heading || '',
        subheading: page.subheading || '',
        backgroundImage: [], // New files only
      });

      setExistingImages(
        page.backgroundImage
          ? page.backgroundImage.map(img => img) // Store the image paths
          : []
      );

      setNewPreview([]);
      setEditId(page._id);
    } else {
      setForm(defaultForm);
      setExistingImages([]);
      setNewPreview([]);
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    newPreview.forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });

    setForm(defaultForm);
    setEditId(null);
    setExistingImages([]);
    setNewPreview([]);
    setOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('pageName', form.pageName);
      formData.append('heading', form.heading);
      formData.append('subheading', form.subheading);

      form.backgroundImage.forEach(file => {
        formData.append('backgroundImage', file);
      });

      // Add the remaining existing images as JSON array string
      formData.append('existingImages', JSON.stringify(existingImages));

      if (editId) {
        await homePageService.update(editId, formData);
      } else {
        await homePageService.create(formData);
      }

      await fetchPages();
      handleClose();
    } catch (e) {
     
    }
  };

  const removeExistingImage = (index) => {
    const updatedExisting = [...existingImages];
    updatedExisting.splice(index, 1);
    setExistingImages(updatedExisting);
  };

  const removeNewImage = (index) => {
    const urlToRevoke = newPreview[index];
    if (urlToRevoke.startsWith('blob:')) URL.revokeObjectURL(urlToRevoke);

    const updatedNewPreview = [...newPreview];
    updatedNewPreview.splice(index, 1);
    setNewPreview(updatedNewPreview);

    const updatedFiles = [...(form.backgroundImage || [])];
    updatedFiles.splice(index, 1);
    setForm(prev => ({
      ...prev,
      backgroundImage: updatedFiles
    }));
  };

  const handleView = (page) => {
    setViewPage(page);
    setViewDialog(true);
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto', bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold">Home Page Management</Typography>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Heading</TableCell>
                  <TableCell>Subheading</TableCell>
                  <TableCell>Background Images</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No home page found.</TableCell>
                  </TableRow>
                ) : pages.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{row.heading}</TableCell>
                    <TableCell>{row.subheading}</TableCell>
                    <TableCell>
                      {row.backgroundImage?.map((img, idx) => (
                        <img
                          key={idx}
                          src={
                            img.startsWith('http')
                              ? img
                              : `http://localhost:5001/${img.replace(/\\/g, '/')}`
                          }
                          alt="bg"
                          style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee', marginRight: 6 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpen(row)}><Edit /></IconButton>
                      <IconButton color="info" onClick={() => handleView(row)}><Visibility /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Home Page' : 'Add Home Page'}</DialogTitle>
        <form onSubmit={handleSave} encType="multipart/form-data">
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Heading"
                name="heading"
                value={form.heading}
                onChange={handleTextChange}
                fullWidth
              />
              <TextField
                label="Subheading"
                name="subheading"
                value={form.subheading}
                onChange={handleTextChange}
                fullWidth
              />
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={existingImages.length + newPreview.length >= 4}
                  sx={{ mb: 1 }}
                >
                  {existingImages.length + newPreview.length >= 4 ? 'Maximum 4 images selected' : `Upload Background Images (${existingImages.length + newPreview.length}/4)`}
                  <input
                    type="file"
                    name="backgroundImage"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleFileChange}
                    disabled={existingImages.length + newPreview.length >= 4}
                  />
                </Button>

                {(existingImages.length > 0 || newPreview.length > 0) && (
                  <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                    {existingImages.map((src, idx) => (
                      <Box key={`existing-${idx}`} position="relative">
                        <img
                          src={
                            src.startsWith('http')
                              ? src
                              : `http://localhost:5001/${src.replace(/\\/g, '/')}`
                          }
                          alt={`Existing ${idx + 1}`}
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeExistingImage(idx)}
                          style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: '#fff',
                            border: '1px solid #ddd',
                            padding: '2px',
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    {newPreview.map((src, idx) => (
                      <Box key={`new-${idx}`} position="relative">
                        <img
                          src={src}
                          alt={`New Preview ${idx + 1}`}
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeNewImage(idx)}
                          style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: '#fff',
                            border: '1px solid #ddd',
                            padding: '2px',
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">{editId ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>View Home Page</DialogTitle>
        <DialogContent dividers>
          {viewPage && (
            <Stack spacing={2}>
              <Typography variant="h6">Heading: {viewPage.heading}</Typography>
              <Typography variant="subtitle1">Subheading: {viewPage.subheading}</Typography>

              <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                {viewPage.backgroundImage?.map((img, idx) => (
                  <img
                    key={idx}
                    src={
                      img.startsWith('http')
                        ? img
                        : `http://localhost:5001/${img.replace(/\\/g, '/')}`
                    }
                    alt={`bg-${idx}`}
                    style={{
                      width: 200,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: '1px solid #ddd'
                    }}
                  />
                ))}
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Home Page</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this Home Page?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
