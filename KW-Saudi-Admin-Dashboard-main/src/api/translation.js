import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


export const translationService = {
  getAllTranslations: async () => {
    const response = await axios.get(`${API_URL}/translations`, { withCredentials: true });
    return response.data;
  },

  getTranslationById: async (id) => {
    const response = await axios.get(`${API_URL}/translations/${id}`, { withCredentials: true });
    return response.data;
  },

  createTranslation: async (translationData) => {
    const response = await axios.post(`${API_URL}/translations`, translationData, { withCredentials: true });
    return response.data;
  },

  updateTranslation: async (id, translationData) => {
    const response = await axios.put(`${API_URL}/translations/${id}`, translationData, { withCredentials: true });
    return response.data;
  },

  deleteTranslation: async (id) => {
    const response = await axios.delete(`${API_URL}/translations/${id}`, { withCredentials: true });
    return response.data;
  },
};
