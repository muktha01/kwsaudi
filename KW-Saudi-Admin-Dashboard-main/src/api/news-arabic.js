const API_BASE_URL = import.meta.env.VITE_API_URL;

export const newsArabicService = {
  // Get all Arabic news
  getAllNews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news-arabic`);
      if (!response.ok) {
        throw new Error('Failed to fetch Arabic news');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get Arabic news by ID
  getNewsById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news-arabic/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Arabic news');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Create Arabic news
  createNews: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news-arabic`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Update Arabic news
  updateNews: async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news-arabic/${id}`, {
        method: 'PUT',
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Delete Arabic news
  deleteNews: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news-arabic/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete Arabic news');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};
