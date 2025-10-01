import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const userService = {
  // Register
  register: async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key]) formData.append(key, data[key]);
      });
      const res = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },
  // Login
  login: async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch users' };
    }
  },
  // Get a single user by ID
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  },
  // Update a user
  updateUser: async (id, data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key]) formData.append(key, data[key]);
      });
      const response = await axios.put(`${API_BASE_URL}/user/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update user' };
    }
  },
  // Delete a user
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/auth/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete user' };
    }
  }
}; 