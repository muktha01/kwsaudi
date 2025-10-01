import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const blogService = {
  // Create a new blog (POST /blog)
  createBlog: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/blog`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create blog' };
    }
  },

  // Get all blogs (GET /blogs)
  getAllBlogs: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch blogs' };
    }
  },

  // Get a single blog by ID (GET /blog/:id)
  getBlogById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch blog' };
    }
  },

  // Update a blog (PUT /blog/:id)
  updateBlog: async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update blog' };
    }
  },

  // Delete a blog (DELETE /blog/:id)
  deleteBlog: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/blog/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete blog' };
    }
  }
}; 