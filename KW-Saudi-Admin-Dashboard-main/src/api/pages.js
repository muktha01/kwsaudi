import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const pagesService = {
  // Get all pages (GET)
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pages`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch pages' };
    }
  },

  // Create a new page (POST)
  create: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/page`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create page' };
    }
  },

  // Get page by ID (GET)
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/page/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch page' };
    }
  },

  // Update a page (PUT)
  update: async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/page/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update page' };
    }
  },

  // Delete a page (DELETE)
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/page/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete page' };
    }
  }
}; 