const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const agentLinkService = {
  // Get all agent links
  getAllAgentLinks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-links`);
      if (!response.ok) {
        throw new Error('Failed to fetch agent links');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching agent links:', error);
      throw error;
    }
  },

  // Get agent link by ID
  getAgentLinkById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-links/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch agent link');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching agent link:', error);
      throw error;
    }
  },

  // Create new agent link
  createAgentLink: async (linkData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating agent link:', error);
      throw error;
    }
  },

  // Update agent link
  updateAgentLink: async (id, linkData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating agent link:', error);
      throw error;
    }
  },

  // Delete agent link (soft delete)
  deleteAgentLink: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-links/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting agent link:', error);
      throw error;
    }
  },

  // Permanently delete agent link
  permanentDeleteAgentLink: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-links/${id}/permanent`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      console.error('Error permanently deleting agent link:', error);
      throw error;
    }
  },

  // Update link order
  updateAgentLinkOrder: async (links) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-links/order/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ links }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating agent link order:', error);
      throw error;
    }
  },
};