import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl,
  IconButton, CircularProgress, Stack, Tooltip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const defaultForm = {
  pageName: '',
  backgroundOverlayContent: '',
  backgroundImage: null,
};

const bannerPageNames = [
  'Home', 'Properties', 
      
   'Franchise',  'Seller Guide', 'Buyer Guide', 
  'KW Training',  'Five Steps To Sell', 'About Us', 'Contact Us', 
   'Why KW', 'KW Technology',  'Events', 'News', 'Jasmin', 'Jeddah', 'Rental Search', 'Recently Rented', 'New development', 'join us', 'Agent', 'Market Center', 'worldwide'
];

export default function PageManagement() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [preview, setPreview] = useState(null);

  // Fetch all pages for the table
  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/pages');
      setPages(res.data);
    } catch (e) {
      setPages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Open form for add or edit
  const handleOpen = (page = defaultForm) => {
    if (page && page._id) {
      setForm({
        pageName: page.pageName || '',
        backgroundOverlayContent: page.backgroundOverlayContent || '',
        backgroundImage: null, // Don't prefill file input
      });
      setPreview(
        page.backgroundImage
          ? page.backgroundImage.startsWith('http')
            ? page.backgroundImage
            : `http://localhost:5001/${page.backgroundImage.replace(/\\/g, '/')}`
          : null
      );
      setEditId(page._id);
    } else {
      setForm(defaultForm);
      setPreview(null);
      setEditId(null);
    }
    setOpen(true);
  };

  // Close form
  const handleClose = () => {
    setForm(defaultForm);
    setEditId(null);
    setOpen(false);
    setPreview(null);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Save (create or update) a page
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });
      if (editId) {
        await axios.put(`http://localhost:5001/api/page/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5001/api/page', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      await fetchPages();
      handleClose();
    } catch (e) {
      console.error('Error saving page:', e, e.response?.data);
      if (e.response?.data?.error) {
        alert('Error: ' + e.response.data.error + (e.response.data.details ? ('\n' + e.response.data.details) : ''));
      } else {
        alert('Error saving page');
      }
    }
  };

  // Delete a page
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/page/${deleteId}`);
      await fetchPages();
      setDeleteDialog(false);
      setDeleteId(null);
    } catch (e) {
      alert('Error deleting page');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto', bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">Page Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add Page</Button>
      </Stack> */}
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
                  <TableCell>Page Name</TableCell>
                  <TableCell>Overlay Content</TableCell>
                  <TableCell>Background Image</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No pages found.</TableCell>
                  </TableRow>
                ) : pages.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{row.pageName}</TableCell>
                    <TableCell>
                      <Tooltip title={row.backgroundOverlayContent || ''} arrow>
                        <span style={{ display: 'inline-block', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {row.backgroundOverlayContent}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {row.backgroundImage && (
                        <img
                          src={
                            row.backgroundImage
                              ? row.backgroundImage.startsWith('http')
                                ? row.backgroundImage
                                : `http://localhost:5001/${row.backgroundImage.replace(/\\/g, '/')}`
                              : ""
                          }
                          alt="bg"
                          style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpen(row)}><Edit /></IconButton>
                      {/* <IconButton color="error" onClick={() => { setDeleteId(row._id); setDeleteDialog(true); }}><Delete /></IconButton> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Page' : 'Add Page'}</DialogTitle>
        <form onSubmit={handleSave} encType="multipart/form-data">
          <DialogContent>
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel>Page Name</InputLabel>
                <Select
                  name="pageName"
                  value={form.pageName}
                  label="Page Name"
                  onChange={handleChange}
                >
                  <MenuItem value=""><em>Select a page name</em></MenuItem>
                  {bannerPageNames.map(name => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Background Overlay Content"
                name="backgroundOverlayContent"
                value={form.backgroundOverlayContent}
                onChange={handleChange}
                multiline
                minRows={4}
                fullWidth
              />
              <Box>
                <Button variant="outlined" component="label">
                  Upload Background Image
                  <input type="file" name="backgroundImage" accept="image/*" hidden onChange={handleChange} />
                </Button>
                {form.backgroundImage && typeof form.backgroundImage === 'object' && (
                  <span style={{ marginLeft: 12 }}>{form.backgroundImage.name}</span>
                )}
                {preview && (
                  <img src={preview} alt="preview" style={{ marginLeft: 16, width: 60, height: 30, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
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
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Page</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this page?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 



// import React, { useEffect, useState } from "react";
// import {
//   Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl,
//   IconButton, CircularProgress, Stack, Tooltip
// } from "@mui/material";
// import { Add, Edit, Delete } from "@mui/icons-material";

// // ✅ Import your API service
// import { pagesService } from "api/pages"; 

// const defaultForm = {
//   pageName: "",
//   backgroundOverlayContent: "",
//   backgroundImage: null,
// };

// const bannerPageNames = [
//   "Home", "Properties", "Franchise", "Seller Guide", "Buyer Guide", 
//   "KW Training", "Five Steps To Sell", "About Us", "Contact Us", 
//   "Why KW", "KW Technology", "Events", "News", "Jasmin", "Jeddah", 
//   "Rental Search", "Recently Rented", "New development", "join us"
// ];

// export default function PageManagement() {
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState(defaultForm);
//   const [editId, setEditId] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteDialog, setDeleteDialog] = useState(false);
//   const [preview, setPreview] = useState(null);

//   // Fetch all pages
//   const fetchPages = async () => {
//     setLoading(true);
//     try {
//       const data = await pagesService.getAll();
//       setPages(data);
//     } catch (e) {
//       setPages([]);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchPages();
//   }, []);

//   // Open form
//   const handleOpen = (page = defaultForm) => {
//     if (page && page._id) {
//       setForm({
//         pageName: page.pageName || "",
//         backgroundOverlayContent: page.backgroundOverlayContent || "",
//         backgroundImage: null,
//       });
//       setPreview(page.backgroundImage ? `http://localhost:5001/${page.backgroundImage.replace(/\\/g, "/")}` : null);
//       setEditId(page._id);
//     } else {
//       setForm(defaultForm);
//       setPreview(null);
//       setEditId(null);
//     }
//     setOpen(true);
//   };

//   // Close form
//   const handleClose = () => {
//     setForm(defaultForm);
//     setEditId(null);
//     setOpen(false);
//     setPreview(null);
//   };

//   // Form field changes
//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === "file") {
//       setForm({ ...form, [name]: files[0] });
//       setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   // Save (Add or Update)
//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       Object.entries(form).forEach(([key, value]) => {
//         if (value !== null && value !== undefined && value !== "") {
//           formData.append(key, value);
//         }
//       });

//       if (editId) {
//         await pagesService.update(editId, formData);
//       } else {
//         await pagesService.create(formData);
//       }

//       await fetchPages();
//       handleClose();
//     } catch (e) {
//       console.error("Error saving page:", e);
//       alert(e.error || "Error saving page");
//     }
//   };

//   // Delete page
//   const handleDelete = async () => {
//     try {
//       await pagesService.delete(deleteId);
//       await fetchPages();
//       setDeleteDialog(false);
//       setDeleteId(null);
//     } catch (e) {
//       alert(e.error || "Error deleting page");
//     }
//   };

//   return (
//     <Box sx={{ p: 4, maxWidth: "1200px", mx: "auto", bgcolor: "#fafafa", minHeight: "100vh" }}>
//       <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h4" fontWeight="bold">Page Management</Typography>
//         <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add Page</Button>
//       </Stack>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
//           <TableContainer>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Page Name</TableCell>
//                   <TableCell>Overlay Content</TableCell>
//                   <TableCell>Background Image</TableCell>
//                   <TableCell align="center">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {pages.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={4} align="center">No pages found.</TableCell>
//                   </TableRow>
//                 ) : pages.map((row) => (
//                   <TableRow key={row._id} hover>
//                     <TableCell>{row.pageName}</TableCell>
//                     <TableCell>
//                       <Tooltip title={row.backgroundOverlayContent || ""} arrow>
//                         <span style={{ display: "inline-block", maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                           {row.backgroundOverlayContent}
//                         </span>
//                       </Tooltip>
//                     </TableCell>
//                     <TableCell>
//                       {row.backgroundImage && (
//                         <img
//                           src={`http://localhost:5001/${row.backgroundImage.replace(/\\/g, "/")}`}
//                           alt="bg"
//                           style={{ width: 80, height: 40, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }}
//                         />
//                       )}
//                     </TableCell>
//                     <TableCell align="center">
//                       <IconButton color="primary" onClick={() => handleOpen(row)}><Edit /></IconButton>
//                       <IconButton color="error" onClick={() => { setDeleteId(row._id); setDeleteDialog(true); }}><Delete /></IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       )}

//       {/* Add/Edit Dialog */}
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle>{editId ? "Edit Page" : "Add Page"}</DialogTitle>
//         <form onSubmit={handleSave} encType="multipart/form-data">
//           <DialogContent>
//             <Stack spacing={2}>
//               <FormControl fullWidth required>
//                 <InputLabel>Page Name</InputLabel>
//                 <Select
//                   name="pageName"
//                   value={form.pageName}
//                   label="Page Name"
//                   onChange={handleChange}
//                 >
//                   <MenuItem value=""><em>Select a page name</em></MenuItem>
//                   {bannerPageNames.map((name) => (
//                     <MenuItem key={name} value={name}>{name}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <TextField
//                 label="Background Overlay Content"
//                 name="backgroundOverlayContent"
//                 value={form.backgroundOverlayContent}
//                 onChange={handleChange}
//                 multiline
//                 minRows={4}
//                 fullWidth
//               />
//               <Box>
//                 <Button variant="outlined" component="label">
//                   Upload Background Image
//                   <input type="file" name="backgroundImage" accept="image/*" hidden onChange={handleChange} />
//                 </Button>
//                 {form.backgroundImage && typeof form.backgroundImage === "object" && (
//                   <span style={{ marginLeft: 12 }}>{form.backgroundImage.name}</span>
//                 )}
//                 {preview && (
//                   <img src={preview} alt="preview" style={{ marginLeft: 16, width: 60, height: 30, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }} />
//                 )}
//               </Box>
//             </Stack>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button type="submit" variant="contained">{editId ? "Update" : "Add"}</Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       {/* Delete Confirmation */}
//       <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
//         <DialogTitle>Delete Page</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to delete this page?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
//           <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }
