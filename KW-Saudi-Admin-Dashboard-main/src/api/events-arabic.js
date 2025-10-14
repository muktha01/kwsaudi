const API_BASE_URL = import.meta.env.VITE_API_URL;

export const eventsArabicService = {
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

  // You can add create, update, delete methods here if needed
};
