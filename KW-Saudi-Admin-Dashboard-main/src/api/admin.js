import axios from 'axios';
import Cookies from 'js-cookie';

// const API_BASE_URL =
  // import.meta.env.VITE_API_URL || 'http://localhost:5001/api'; 

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ensures cookies are sent
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminService = {
  // Admin Register
  // register: async (data) => {
  //   try {
  //     const res = await axios.post(`${API_BASE_URL}/auth/register`, data, {
  //       headers: { 'Content-Type': 'application/json' },
  //       withCredentials: true
  //     });
  //     return res.data;
  //   } catch (error) {
  //     throw error.response?.data || { error: 'Admin registration failed' };
  //   }
  // },

    register: async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { error: 'Admin registration failed' };
    }
  },

  // Admin Login
  // login: async (data) => {
  //   try {
  //     const res = await axios.post(`${API_BASE_URL}/auth/login`, data, {
  //       headers: { 'Content-Type': 'application/json' },
  //       withCredentials: true
  //     });
  //     return res.data;
  //   } catch (error) {
  //     throw error.response?.data || { error: 'Admin login failed' };
  //   }
  // },

   login: async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      return res.data; // expect backend to return { success, user: {id, role} }
    } catch (error) {
      throw error.response?.data || { error: 'Admin login failed' };
    }
  },

  // Get admin profile
  // getProfile: async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
  //       withCredentials: true
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || { error: 'Failed to fetch admin profile' };
  //   }
  // },

   getProfile: async () => {
    try {
      const res = await api.get('/auth/profile');
      return res.data; // should contain user info { id, name, role }
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  // Update admin profile
  updateProfile: async (data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update admin profile' };
    }
  },

  // Change admin password
  // changePassword: async (data) => {
  //   try {
  //     const response = await axios.put(`${API_BASE_URL}/auth/change-password`, data, {
  //       headers: { 'Content-Type': 'application/json' },
  //       withCredentials: true
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || { error: 'Failed to change password' };
  //   }
  // },

   changePassword: async (data) => {
    try {
      const res = await api.put('/auth/change-password', data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to change password' };
    }
  },

  // Logout admin
  // logout: async () => {
  //   try {
  //     await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
  //       withCredentials: true
  //     });
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   }
  //   localStorage.removeItem('admin');
  // },

   // Logout (clears cookie in backend)
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Check if admin is authenticated
  // isAuthenticated: () => {
  //   const admin = localStorage.getItem('admin');
  //   return !!admin;
  // },

    isAuthenticated: async () => {
    try {
      const profile = await adminService.getProfile();
      return !!profile;
    } catch {
      return false;
    }
  },


  // // Get current admin data
  // getCurrentAdmin: () => {
  //   const admin = localStorage.getItem('admin');
  //   return admin ? JSON.parse(admin) : null;
  // },

  // Get all users (admin, subadmin, user)
  // getAllUsers: async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/auth/all-users`, {
  //       withCredentials: true
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || { error: 'Failed to fetch users' };
  //   }
  // },

    getAllUsers: async () => {
    try {
      const res = await api.get('/auth/all-users');
      return res.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch users' };
    }
  },

  // Set user role and permissions (admin only)
  // setUserRoleAndPermissions: async (userId, role, permissions = []) => {
  //   try {
  //     const response = await axios.put(
  //       `${API_BASE_URL}/auth/set-role`,
  //       { userId, role, permissions },
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: true
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || { error: 'Failed to update user role/permissions' };
  //   }
  // },

    setUserRoleAndPermissions: async (userId, role, permissions = []) => {
    try {
      const res = await api.put('/auth/set-role', { userId, role, permissions });
      return res.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update role/permissions' };
    }
  },

  // Update user (admin only)
  // updateUser: async (id, data) => {
  //   try {
  //     const response = await axios.put(
  //       `${API_BASE_URL}/auth/user/${id}`,
  //       data,
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: true
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || { error: 'Failed to update user' };
  //   }
  // },

    updateUser: async (id, data) => {
    try {
      const res = await api.put(`/auth/user/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update user' };
    }
  },
  // Delete user (admin only)
  // deleteUser: async (id) => {
  //   try {
  //     const response = await axios.delete(`${API_BASE_URL}/auth/user/${id}`, {
  //       withCredentials: true
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || { error: 'Failed to delete user' };
  //   }
  // },

  deleteUser: async (id) => {
    try {
      const res = await api.delete(`/auth/user/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete user' };
    }
  },
};
