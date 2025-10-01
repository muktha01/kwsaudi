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
import { eventService } from 'api/event';
import RichTextEditor from 'components/RichTextEditor';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEventContent, setSelectedEventContent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    startDate: '',
    endDate: '',
    time: '',
    location: '',
    cost: '',
    presentedBy: '',
    team: '',
    description: '',
    audience: '',
    contactEmail: '',
    sessions: []
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents();
      setEvents(response);
    } catch (error) {
      showMessage('error', 'Failed to fetch events');
    }
  };

  const showMessage = (type, message) => {
    // You can implement a proper notification system here
    console.log(`${type}: ${message}`);
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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      startDate: '',
      endDate: '',
      time: '',
      location: '',
      cost: '',
      presentedBy: '',
      team: '',
      description: '',
      audience: '',
      contactEmail: '',
      sessions: []
    });
    setImagePreview(null);
    setSelectedEvent(null);
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
          if (key === 'sessions') {
            // Handle sessions array
            if (formData[key].length > 0) {
              formDataToSend.append(key, JSON.stringify(formData[key]));
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Add cover image
      const coverImageInput = document.querySelector('input[name="coverImage"]');
      if (coverImageInput?.files[0]) {
        formDataToSend.append('coverImage', coverImageInput.files[0]);
      }

      if (isEditing && selectedEvent) {
        await eventService.updateEvent(selectedEvent._id, formDataToSend);
        showMessage('success', 'Event updated successfully!');
      } else {
        await eventService.createEvent(formDataToSend);
        showMessage('success', 'Event created successfully!');
      }

      fetchEvents();
      resetForm();
      setShowForm(false);
    } catch (error) {
      showMessage('error', error.error || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setFormData({
      title: event.title || '',
      subtitle: event.subtitle || '',
      startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      time: event.time || '',
      location: event.location || '',
      cost: event.cost || '',
      presentedBy: event.presentedBy || '',
      team: event.team || '',
      description: event.description || '',
      audience: event.audience || '',
      contactEmail: event.contactEmail || '',
      sessions: event.sessions || []
    });
    setImagePreview(event.coverImage);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await eventService.deleteEvent(eventId);
      showMessage('success', 'Event deleted successfully');
      fetchEvents();
      if (selectedEvent?._id === eventId) {
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      showMessage('error', 'Failed to delete event');
    }
  };

  const handleView = (event) => {
    setSelectedEventContent(event);
  };

  const closeViewDialog = () => {
    setSelectedEventContent(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Event Management
      </Typography>

      {/* Event Form */}
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
    {showForm ? 'Cancel' : 'Add Event'}
  </Button>
</Box>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                name="title"
                label="Event Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                fullWidth
              />

            

              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                name="endDate"
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

             <TextField
  name="time"
  label="Event Time"
  type="time"
  value={formData.time}
  onChange={handleInputChange}
  fullWidth
  InputLabelProps={{
    shrink: true, // keeps label above
  }}
  inputProps={{
    step: 300, // 5 min steps
  }}
/>


              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Online or Physical Location"
                fullWidth
              />

              <TextField
                name="cost"
                label="Cost"
                value={formData.cost}
                onChange={handleInputChange}
                placeholder="e.g., Free or $50"
                fullWidth
              />

              
             
              <RichTextEditor
                label="Description"
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                placeholder="Enter event description with formatting..."
              />

              {/* <TextField
                name="audience"
                label="Target Audience"
                value={formData.audience}
                onChange={handleInputChange}
                placeholder="Who should attend"
                fullWidth
              /> */}

              
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
                  {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
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

      {/* Events Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          All Events
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
             
                <TableCell>Start Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event._id}>
                  <TableCell>
                    {event.coverImage && (
                      <img
                        src={
                          event.coverImage.startsWith('http')
                            ? event.coverImage
                            : `${import.meta.env.VITE_BASE_URL}/${event.coverImage}`
                        }
                        alt={event.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{event.title}</TableCell>
                  
                  <TableCell>
                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{event.location || '-'}</TableCell>
                  <TableCell>{event.cost || '-'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(event)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(event)}
                        color="secondary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(event._id)}
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

      {/* View Event Dialog */}
      <Dialog
        open={!!selectedEventContent}
        onClose={closeViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEventContent?.title}
        </DialogTitle>
        <DialogContent>
          {selectedEventContent && (
            <Box>
              {selectedEventContent.coverImage && (
                <img
                  src={
                    selectedEventContent.coverImage.startsWith('http')
                      ? selectedEventContent.coverImage
                      : `http://localhost:5001/${selectedEventContent.coverImage}`
                  }
                  alt={selectedEventContent.title}
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '20px' }}
                />
              )}

              <Typography variant="h6" gutterBottom>
                {selectedEventContent.subtitle}
              </Typography>

              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedEventContent.location && (
                  <Chip
                    icon={<span>📍</span>}
                    label={selectedEventContent.location}
                    variant="outlined"
                  />
                )}
                {selectedEventContent.startDate && (
                  <Chip
                    icon={<span>📅</span>}
                    label={`${new Date(selectedEventContent.startDate).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}`}
                    variant="outlined"
                  />
                )}
                {selectedEventContent.cost && (
                  <Chip
                    icon={<span>💰</span>}
                    label={selectedEventContent.cost}
                    variant="outlined"
                  />
                )}
              </Box>

              {selectedEventContent.time && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ⏰ {selectedEventContent.time}
                </Typography>
              )}

              
              {selectedEventContent.team && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  👥 Team: {selectedEventContent.team}
                </Typography>
              )}

              {selectedEventContent.description && (
                <Box 
                  sx={{ 
                    mb: 2,
                    '& h1': { fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5em 0' },
                    '& h2': { fontSize: '1.25rem', fontWeight: 'bold', margin: '0.5em 0' },
                    '& h3': { fontSize: '1.1rem', fontWeight: 'bold', margin: '0.5em 0' },
                    '& p': { margin: '0.5em 0' },
                    '& ul, & ol': { paddingLeft: '1.5rem', margin: '0.5em 0' },
                    '& li': { marginBottom: '0.25em' },
                    '& strong': { fontWeight: 'bold' },
                    '& em': { fontStyle: 'italic' },
                    '& u': { textDecoration: 'underline' }
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedEventContent.description }}
                />
              )}

              {selectedEventContent.audience && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  🎯 <strong>Who should attend:</strong> {selectedEventContent.audience}
                </Typography>
              )}

              {selectedEventContent.contactEmail && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📧 <strong>Contact:</strong> {selectedEventContent.contactEmail}
                </Typography>
              )}

              {selectedEventContent.sessions && selectedEventContent.sessions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    📋 Sessions
                  </Typography>
                  {selectedEventContent.sessions.map((session, index) => (
                    <Box key={index} sx={{ mb: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {session.sessionTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📅 {new Date(session.date).toLocaleDateString()} | ⏰ {session.time}
                      </Typography>
                    </Box>
                  ))}
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

export default EventManagement;
