import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, CircularProgress, Stack, Tooltip, Typography, InputAdornment
} from "@mui/material";
import { Add, Edit, Delete, Search, Visibility } from "@mui/icons-material";
import { seoService } from "api/seo";
import { pagesService } from "api/pages";

const defaultForm = {
  pageName: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: ""
};

export default function SeoManagement() {
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [pages, setPages] = useState([]);
  const [search, setSearch] = useState("");
  const [isAddingNewPage, setIsAddingNewPage] = useState(false);
  const [newPageName, setNewPageName] = useState("");

  // ✅ new states for view dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  // Fetch SEO data
  const fetchSeoData = async () => {
    setLoading(true);
    try {
      const data = await seoService.getAllSEO();
      setSeoData(data);
    } catch (e) {
      console.error("SEO fetch error:", e);
      setSeoData([]);
    }
    setLoading(false);
  };

  // Fetch pages
  const fetchPages = async () => {
    try {
      const data = await pagesService.getAll();
      setPages(data);
    } catch (e) {
      console.error("Pages fetch error:", e);
    }
  };

  useEffect(() => {
    fetchSeoData();
    fetchPages();
  }, []);

  // Open modal
  const handleOpen = (seo = defaultForm) => {
    if (seo && seo._id) {
      setForm({
        pageName: seo.pageName || "",
        metaTitle: seo.metaTitle || "",
        metaDescription: seo.metaDescription || "",
        metaKeywords: seo.metaKeywords || ""
      });
      setEditId(seo._id);
      setIsAddingNewPage(false);
      setNewPageName("");
    } else {
      setForm(defaultForm);
      setEditId(null);
      setIsAddingNewPage(false);
      setNewPageName("");
    }
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setForm(defaultForm);
    setEditId(null);
    setOpen(false);
    setIsAddingNewPage(false);
    setNewPageName("");
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save SEO
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let submitData = { ...form };
      if (isAddingNewPage && newPageName.trim()) {
        submitData.pageName = newPageName.trim();
      }
      if (editId) {
        await seoService.updateSEO(editId, submitData);
      } else {
        await seoService.createSEO(submitData);
      }
      await fetchSeoData();
      handleClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving SEO entry");
    }
  };

  // Delete SEO
  const handleDelete = async (id) => {
    try {
      await seoService.deleteSEO(id);
      await fetchSeoData();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting SEO entry");
    }
  };

  // ✅ View SEO details
  const handleView = (row) => {
    setViewData(row);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewData(null);
    setViewOpen(false);
  };

  // Filtered search
  const filteredData = seoData.filter((entry) =>
    entry.pageName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", mx: "auto", bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          SEO Management
        </Typography>
        {/* <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add SEO
        </Button> */}
      </Stack>

      {/* Search Bar */}
      <TextField
        placeholder="Search by Page Name"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
        sx={{ mb: 2 }}
      />

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
                  <TableCell>Meta Title</TableCell>
                  <TableCell>Meta Description</TableCell>
                  <TableCell>Meta Keywords</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No SEO entries found.</TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow key={row._id} hover>
                      <TableCell>{row.pageName}</TableCell>
                      <TableCell>
                        <Tooltip title={row.metaTitle || ""} arrow>
                          <span style={{ display: "inline-block", maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {row.metaTitle}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={row.metaDescription || ""} arrow>
                          <span style={{ display: "inline-block", maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {row.metaDescription}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={row.metaKeywords || ""} arrow>
                          <span style={{ display: "inline-block", maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {row.metaKeywords}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleOpen(row)}><Edit /></IconButton>
                        <IconButton color="info" onClick={() => handleView(row)}><Visibility /></IconButton>
                        {/* <IconButton
                          color="error"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this SEO entry?")) {
                              handleDelete(row._id);
                            }
                          }}
                        >
                          <Delete />
                        </IconButton> */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit SEO Entry" : "Add SEO Entry"}</DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <Stack spacing={2}>


              {/* Only show Page Name selection when adding, not editing */}
              {!editId && (
                !isAddingNewPage ? (
                  <TextField
                    label="Page Name"
                    name="pageName"
                    value={form.pageName}
                    onChange={(e) => {
                      if (e.target.value === "__add_new__") {
                        setIsAddingNewPage(true);
                        setNewPageName("");
                        setForm((prev) => ({ ...prev, pageName: "" }));
                      } else {
                        setForm((prev) => ({ ...prev, pageName: e.target.value }));
                      }
                    }}
                    fullWidth
                    required
                    select
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select a page</option>
                    {pages.map((page) => (
                      <option key={page._id} value={page.pageName}>{page.pageName}</option>
                    ))}
                    <option value="__add_new__">Add new page...</option>
                  </TextField>
                ) : (
                  <TextField
                    label="New Page Name"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <Button onClick={() => setIsAddingNewPage(false)} size="small">Cancel</Button>
                      )
                    }}
                    autoFocus
                  />
                )
              )}

              <TextField
                label="Meta Title"
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Meta Description"
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                multiline
                minRows={3}
                fullWidth
                required
              />
              <TextField
                label="Meta Keywords"
                name="metaKeywords"
                value={form.metaKeywords}
                onChange={handleChange}
                fullWidth
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editId ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle>SEO Details</DialogTitle>
        <DialogContent dividers>
          {viewData && (
            <Stack spacing={2}>
              <Typography><strong>Page Name:</strong> {viewData.pageName}</Typography>
              <Typography><strong>Meta Title:</strong> {viewData.metaTitle}</Typography>
              <Typography><strong>Meta Description:</strong> {viewData.metaDescription}</Typography>
              <Typography><strong>Meta Keywords:</strong> {viewData.metaKeywords}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
}
