import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const homePageService = {
  // Get all Home Pages (GET)
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/home-pages`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch home pages' };
    }
  },

  // Create Home Page (POST)
  create: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/home-page`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create home page' };
    }
  },

  // Get Home Page by ID (GET)
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/home-page/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch home page' };
    }
  },

  // Update Home Page (PUT)
  update: async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/home-page/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update home page' };
    }
  },

  // Delete Home Page (DELETE)
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/home-page/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete home page' };
    }
  }
};
