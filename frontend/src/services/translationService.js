// Frontend Translation API Service
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: false, // Changed to false to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
});

export const frontendTranslationService = {
  // Get all translations from backend
  getAllTranslations: async () => {
    try {
      // console.log('🌐 Fetching translations from:', `${API_BASE_URL}/translations`);
      const response = await api.get(`${API_BASE_URL}/translations`);
      // console.log('✅ Translation response:', response.status, response.data?.length || 0, 'items');
      return response.data;
    } catch (error) {
      // console.error('❌ Error fetching translations:', error.message);
      if (error.response) {
        // console.error('Response status:', error.response.status);
        // console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Get translation by key
  getTranslationByKey: async (key) => {
    try {
      const response = await api.get('/translations', {
        params: { key }
      });
      return response.data.find(translation => translation.key === key);
    } catch (error) {
      // console.error('Error fetching translation by key:', error);
      throw error;
    }
  },

  // Batch fetch translations with better error handling
  fetchTranslationsBatch: async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
  
        const response = await api.get(`${API_BASE_URL}/translations`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.data && Array.isArray(response.data)) {
          // console.log(`✅ Successfully fetched ${response.data.length} translations`);
          return response.data;
        }
        throw new Error('Invalid response format');
      } catch (error) {
        // console.error(`❌ Translation fetch attempt ${i + 1} failed:`, error.message);
        
        if (error.code === 'ERR_NETWORK' || error.message.includes('ECONNREFUSED')) {
          // console.error('💡 Backend server may not be running on port 5001');
        }
        
        if (i === retries - 1) throw error;
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  },

  // Test backend connectivity
  testConnection: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/test`, { timeout: 10000 });
      // console.log('✅ Backend connection test successful:', response.data);
      return true;
    } catch (error) {
      // console.error('❌ Backend connection test failed:', error.message);
      return false;
    }
  },

  // Real-time translation updates listener
  subscribeToTranslationUpdates: (callback) => {
    let interval;
    let isSubscribed = true;
    
    const pollForUpdates = async () => {
      if (!isSubscribed) return;
      
      try {
        const translations = await frontendTranslationService.getAllTranslations();
        if (callback && typeof callback === 'function') {
          callback(translations);
        }
      } catch (error) {
        // console.error('Error polling for translation updates:', error);
      }
    };
    
    // Poll every 30 seconds
    interval = setInterval(pollForUpdates, 30000);
    
    // Return unsubscribe function
    return () => {
      isSubscribed = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }
};

// Export as default
export default frontendTranslationService;