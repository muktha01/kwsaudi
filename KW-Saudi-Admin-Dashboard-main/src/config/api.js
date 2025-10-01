// API Configuration  
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/auth/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,
};

export default API_BASE_URL;