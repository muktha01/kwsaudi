const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const eventService = {
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/event/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error fetching event:', error);
      throw error;
    }
  },

  // Create event
  createEvent: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/event`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      // console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event
  updateEvent: async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/event/${id}`, {
        method: 'PUT',
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      // console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/event/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/upcoming`);
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming events');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error fetching upcoming events:', error);
      throw error;
    }
  },

  // Get events by team
  getEventsByTeam: async (team) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/team/${team}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events by team');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error fetching events by team:', error);
      throw error;
    }
  },

  // Get events by location
  getEventsByLocation: async (location) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/location/${location}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events by location');
      }
      return await response.json();
    } catch (error) {
      // console.error('Error fetching events by location:', error);
      throw error;
    }
  }
};
