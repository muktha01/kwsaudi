const API_BASE_URL = import.meta.env.VITE_API_URL;

export const eventArabicService = {
  // Get all Arabic events
  getAllEvents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events-arabic`);
      if (!response.ok) {
        throw new Error('Failed to fetch Arabic events');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get Arabic event by ID
  getEventById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events-arabic/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Arabic event');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Create Arabic event
  createEvent: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events-arabic`, {
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

  // Update Arabic event
  updateEvent: async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events-arabic/${id}`, {
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

  // Delete Arabic event
  deleteEvent: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events-arabic/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete Arabic event');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};
