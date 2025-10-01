

// import axios from "axios";

// const API_BASE_URL = "http://localhost:5001/api";

// export const employeeService = {
//   // Get employees by team
//   getEmployeesByTeam: async (team) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/employee/team/${team}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { error: "Failed to fetch employees" };
//     }
//   },

//   // Update employee (with image if uploaded)
//   updateEmployee: async (id, formData) => {
//     try {
//       const response = await axios.put(`${API_BASE_URL}/employee/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { error: "Failed to update employee" };
//     }
//   },

//   // Delete employee
//   deleteEmployee: async (id) => {
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/employee/${id}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { error: "Failed to delete employee" };
//     }
//   },
// };

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const employeeService = {
  // Create a new employee (POST)
  createEmployee: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/employee`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to create employee" };
    }
  },

  // Get employees by team (GET)
  getEmployeesByTeam: async (team) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employee/team/${team}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch employees" };
    }
  },

  // Update employee (PUT - with image if uploaded)
  updateEmployee: async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/employee/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update employee" };
    }
  },

  // Delete employee (DELETE)
  deleteEmployee: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/employee/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to delete employee" };
    }
  },
};
