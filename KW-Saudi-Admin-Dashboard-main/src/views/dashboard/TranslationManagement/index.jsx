/* eslint-disable */
import { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { translationService } from '../../../api/translation';

const TranslationManagement = () => {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState({ key: '', value: '', _id: null });
  const [search, setSearch] = useState('');

  const fetchTranslations = async () => {
    try {
      const data = await translationService.getAllTranslations();
      setTranslations(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const handleOpenDialog = (translation = { key: '', value: '', _id: null }) => {
    setCurrentTranslation(translation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTranslation({ key: '', value: '', _id: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTranslation(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (currentTranslation._id) {
        await translationService.updateTranslation(currentTranslation._id, { key: currentTranslation.key, value: currentTranslation.value });
      } else {
        await translationService.createTranslation({ key: currentTranslation.key, value: currentTranslation.value });
      }
      fetchTranslations();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving translation:', err);
      setError(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await translationService.deleteTranslation(id);
      fetchTranslations();
    } catch (err) {
      console.error('Error deleting translation:', err);
      setError(err);
    }
  };

  // Filter translations by search
  const filteredTranslations = translations.filter(t =>
    t.key.toLowerCase().includes(search.toLowerCase()) ||
    t.value.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Typography>Loading translations...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Translation Management</Typography>
        {/* <Button variant="contained" startIcon={<IconPlus />} onClick={() => handleOpenDialog()}>Add New Translation</Button> */}
      </Box>
      <Box mb={2}>
        <TextField
          label="Search by key or value"
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
        />
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTranslations.map((translation) => (
              <TableRow key={translation._id}>
                <TableCell>{translation.key}</TableCell>
                <TableCell>{translation.value}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(translation)}><IconEdit /></IconButton>
                  {/* <IconButton color="error" onClick={() => handleDelete(translation._id)}><IconTrash /></IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentTranslation._id ? 'Edit Translation' : 'Add New Translation'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="key"
            label="Key"
            type="text"
            fullWidth
            variant="outlined"
            value={currentTranslation.key}
            onChange={handleChange}
            disabled={!!currentTranslation._id}
          />
          <TextField
            margin="dense"
            name="value"
            label="Value"
            type="text"
            fullWidth
            variant="outlined"
            value={currentTranslation.value}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>{currentTranslation._id ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TranslationManagement;
