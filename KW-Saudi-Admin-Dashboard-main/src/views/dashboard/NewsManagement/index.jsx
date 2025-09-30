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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { newsService } from 'api/news';
import RichTextEditor from 'components/RichTextEditor';

// Backend URL constant
const BACKEND_URL = 'http://localhost:5001';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNewsContent, setSelectedNewsContent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
    isPublished: false,
    location: '',
    eventDate: '',
    category: ''
  });

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllNews();
      setNews(response);
    } catch (error) {
      console.error('Error fetching news:', error);
      showMessage('error', 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, message) => {
    // You can implement a proper notification system here
    if (type === 'error') {
      console.error(message);
    } else {
      console.log(`${type}: ${message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For new file uploads, create object URL for preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    // For new file uploads, create object URLs for preview
    const previews = files.map(file => URL.createObjectURL(file));
    setAdditionalImagesPreview(previews);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      tags: '',
      isPublished: false,
      location: '',
      eventDate: '',
      category: ''
    });
    setImagePreview(null);
    setAdditionalImagesPreview([]);
    setSelectedNews(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add images
      const coverImageInput = document.querySelector('input[name="coverImage"]');
      if (coverImageInput?.files[0]) {
        formDataToSend.append('coverImage', coverImageInput.files[0]);
      }

      

      if (isEditing && selectedNews) {
        await newsService.updateNews(selectedNews._id, formDataToSend);
        showMessage('success', 'News updated successfully!');
      } else {
        await newsService.createNews(formDataToSend);
        showMessage('success', 'News created successfully!');
      }

      fetchNews();
      resetForm();
      setShowForm(false);
    } catch (error) {
      showMessage('error', error.error || 'Failed to save news');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsItem) => {
    setSelectedNews(newsItem);
    setIsEditing(true);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      author: newsItem.author,
      tags: newsItem.tags?.join(', ') || '',
      isPublished: newsItem.isPublished,
      location: newsItem.location || '',
      eventDate: newsItem.eventDate ? new Date(newsItem.eventDate).toISOString().split('T')[0] : '',
      category: newsItem.category || ''
    });
    // Fix: Use full URL for existing images
    setImagePreview(newsItem.coverImage ? `${BACKEND_URL}/${newsItem.coverImage}` : null);
    setAdditionalImagesPreview(newsItem.additionalImages ? 
      newsItem.additionalImages.map(img => `${BACKEND_URL}/${img}`) : []);
    setShowForm(true);
  };

  const handleDelete = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news?')) {
      return;
    }

    try {
      await newsService.deleteNews(newsId);
      showMessage('success', 'News deleted successfully');
      fetchNews();
      if (selectedNews?._id === newsId) {
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      showMessage('error', 'Failed to delete news');
    }
  };

  const handleView = (newsItem) => {
    setSelectedNewsContent(newsItem);
  };

  const closeViewDialog = () => {
    setSelectedNewsContent(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        News Management
      </Typography>

      {/* News Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
       <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
  <Button
    variant="outlined"
    onClick={() => {
      if (showForm) {
        resetForm();
        setShowForm(false);
      } else {
        setShowForm(true);
        resetForm();
      }
    }}
  >
    {showForm ? 'Cancel' : 'Add News'}
  </Button>
</Box>


        {showForm && (
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <RichTextEditor
                label="Content"
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Enter news content with formatting..."
              />
{/* 
              <TextField
                name="author"
                label="Author"
                value={formData.author}
                onChange={handleInputChange}
                fullWidth
              /> */}

              {/* <TextField
                name="tags"
                label="Tags (comma separated)"
                value={formData.tags}
                onChange={handleInputChange}
                fullWidth
              /> */}

              {/* <TextField
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleInputChange}
                fullWidth
              /> */}

              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
              />

              <TextField
                name="eventDate"
                label="News Date"
                type="date"
                value={formData.eventDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

             
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Cover Image
                </Typography>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginBottom: '10px' }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('Error loading image preview:', e);
                      setImagePreview(null);
                    }}
                  />
                )}
              </Box>

             

          

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {loading ? 'Saving...' : isEditing ? 'Update News' : 'Create News'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Paper>

      {/* News Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          All News
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
           
                <TableCell>Location</TableCell>
                <TableCell> Date</TableCell>
             
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {news.map((newsItem) => (
                <TableRow key={newsItem._id}>
                  <TableCell>
                    {newsItem.coverImage && (
                      <img
                        src={
                          newsItem.coverImage.startsWith('http')
                            ? newsItem.coverImage
                            : `${BACKEND_URL}/${newsItem.coverImage}`
                        }
                        alt={newsItem.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ 
                    maxWidth: '200px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {newsItem.title}
                  </TableCell>
                  
                  <TableCell>{newsItem.location || '-'}</TableCell>
                  <TableCell>
                    {newsItem.eventDate ? new Date(newsItem.eventDate).toLocaleDateString() : '-'}
                  </TableCell>
                  
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(newsItem)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(newsItem)}
                        color="secondary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(newsItem._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View News Dialog */}
      <Dialog
        open={!!selectedNewsContent}
        onClose={closeViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedNewsContent?.title}
        </DialogTitle>
        <DialogContent>
          {selectedNewsContent && (
            <Box>
              {selectedNewsContent.coverImage && (
                <img
                  src={
                    selectedNewsContent.coverImage.startsWith('http')
                      ? selectedNewsContent.coverImage
                      : `${BACKEND_URL}/${selectedNewsContent.coverImage}`
                  }
                  alt={selectedNewsContent.title}
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '20px' }}
                />
              )}

              {(selectedNewsContent.location || selectedNewsContent.eventDate) && (
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedNewsContent.location && (
                    <Chip
                      icon={<span>📍</span>}
                      label={`${selectedNewsContent.location}`}
                      variant="outlined"
                    />
                  )}
                  {selectedNewsContent.eventDate && (
                    <Chip
                      icon={<span>📅</span>}
                      label={`${new Date(selectedNewsContent.eventDate).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}`}
                      variant="outlined"
                    />
                  )}
                </Box>
              )}

              <Typography variant="body2" color="text.secondary" gutterBottom>
                By {selectedNewsContent.author}
              </Typography>

              <Box 
                sx={{ 
                  mb: 2,
                  '& h1': { fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5em 0' },
                  '& h2': { fontSize: '1.25rem', fontWeight: 'bold', margin: '0.5em 0' },
                  '& h3': { fontSize: '1.1rem', fontWeight: 'bold', margin: '0.5em 0' },
                  '& p': { margin: '0.5em 0', lineHeight: 1.6 },
                  '& ul, & ol': { paddingLeft: '1.5rem', margin: '0.5em 0' },
                  '& li': { marginBottom: '0.25em' },
                  '& strong': { fontWeight: 'bold' },
                  '& em': { fontStyle: 'italic' },
                  '& u': { textDecoration: 'underline' },
                  wordBreak: 'break-word'
                }}
                dangerouslySetInnerHTML={{ __html: selectedNewsContent.content }}
              />

              {selectedNewsContent.additionalImages && selectedNewsContent.additionalImages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Images
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedNewsContent.additionalImages.map((image, index) => (
                      <img
                        key={index}
                        src={
                          image.startsWith('http')
                            ? image
                            : `${BACKEND_URL}/${image}`
                        }
                        alt={`Additional ${index + 1}`}
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {selectedNewsContent.tags?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedNewsContent.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewsManagement;
