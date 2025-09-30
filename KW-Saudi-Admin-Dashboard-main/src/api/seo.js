import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const seoService = {
  // Create SEO (POST)
  createSEO: async (seoData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/seo`, seoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create SEO' };
    }
  },

  // Update SEO (PUT)
  updateSEO: async (id, seoData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/seo/${id}`, seoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update SEO' };
    }
  },

  // Delete SEO (DELETE)
  deleteSEO: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/seo/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete SEO' };
    }
  },

  // Get all SEO entries (GET)
  getAllSEO: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/seo`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch SEO entries' };
    }
  }
}; 