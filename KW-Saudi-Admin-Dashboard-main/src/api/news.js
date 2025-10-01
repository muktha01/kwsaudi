const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const newsService = {
  // Get all news
  getAllNews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Get news by ID
  getNewsById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Create news
  createNews: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      // console.error('Error creating news:', error);
      throw error;
    }
  },

  // Update news
  updateNews: async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'PUT',
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      // console.error('Error updating news:', error);
      throw error;
    }
  },

  // Delete news
  deleteNews: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete news');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error deleting news:', error);
      throw error;
    }
  },

  // Get news by category
  getNewsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/category/${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news by category');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error fetching news by category:', error);
      throw error;
    }
  }
};
