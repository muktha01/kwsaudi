// HeaderFooterPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Container,
  Button,
} from '@mui/material';

const HeaderFooterPage = () => {
  const [headerContent, setHeaderContent] = useState('');
  const [footerContent, setFooterContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial data
  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api-management/`)
      .then((res) => res.json())
      .then((data) => {
        setHeaderContent(data.header || '');
        setFooterContent(data.footer || '');
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError('Failed to load data');
      });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    setError('');
    const payload = {
      header: headerContent,
      footer: footerContent,
    };
    try {
      // Use PUT to update (or POST for first time)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api-management/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess(true);
    } catch (e) {
      setError('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {loading && <Typography color="text.secondary">Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
    
 <Typography 
  variant="h4"  
  gutterBottom
  sx={{ py: 2 }} // adjust 2 to whatever spacing you need
>
  Google Analytics Management
</Typography>
      {/* Header Box */}
      <Box
        sx={{
          border: '2px solid black',
          borderRadius: 2,
          p: 3,
          mb: 5,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Header Content
        </Typography>
        <TextField
          multiline
          minRows={4}
          fullWidth
          variant="outlined"
          placeholder="Write your header content here..."
          value={headerContent}
          onChange={(e) => setHeaderContent(e.target.value)}
        />
      </Box>

      {/* Footer Box */}
      <Box
        sx={{
          border: '2px solid black',
          borderRadius: 2,
          p: 3,
          mb: 3,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Footer Content
        </Typography>
        <TextField
          multiline
          minRows={4}
          fullWidth
          variant="outlined"
          placeholder="Write your footer content here..."
          value={footerContent}
          onChange={(e) => setFooterContent(e.target.value)}
        />
      </Box>

      {/* Submit Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Submit'}
          
        </Button>
          {success && <Typography color="success.main">Saved successfully!</Typography>}
      </Box>
    </Container>
  );
};

export default HeaderFooterPage;
