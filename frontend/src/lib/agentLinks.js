// Frontend API service for fetching agent links
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAgentLinks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/agent-links`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching agent links:', error);
    throw error;
  }
};

export const fetchAgentLinkById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/agent-links/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching agent link:', error);
    throw error;
  }
};