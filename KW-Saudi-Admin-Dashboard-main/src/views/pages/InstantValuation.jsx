import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';

const InstantValuation = () => {
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchValuations = async () => {
      setLoading(true);npm
      setError(null);
      try {
        const res = await fetch('http://localhost:5001/api/leads');
        const data = await res.json();
        const filtered = Array.isArray(data) ? data.filter(lead => lead.formType === 'instant-valuation') : [];
        setValuations(filtered);
      } catch (err) {
        setError('Failed to fetch instant valuation data');
      } finally {
        setLoading(false);
      }
    };
    fetchValuations();
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto', bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" mb={2} color="text.primary">
        Instant Valuation Data
      </Typography>
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
                  <TableCell>Full Name</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {valuations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No instant valuations found.</TableCell>
                  </TableRow>
                ) : valuations.map((item, idx) => (
                  <TableRow key={item._id || idx}>
                    <TableCell>{item.fullName || '-'}</TableCell>
                    <TableCell>{item.mobileNumber || '-'}</TableCell>
                    <TableCell>{item.email || '-'}</TableCell>
                    <TableCell>{item.city || '-'}</TableCell>
                    <TableCell>{item.message || '-'}</TableCell>
                    <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default InstantValuation; 