// Simple test script to verify backend translation API
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

console.log('🔧 Testing Backend Translation API...\n');

async function testBackend() {
  try {
    // Test 1: Health check
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/test`, { timeout: 5001 });
    console.log('✅ Backend health:', healthResponse.data);

    // Test 2: Get translations
    console.log('\n2. Testing translation fetch...');
    const translationsResponse = await axios.get(`${API_BASE_URL}/translations`, { 
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Translations response status:', translationsResponse.status);
    console.log('✅ Number of translations:', translationsResponse.data?.length || 0);
    
    if (translationsResponse.data?.length > 0) {
      console.log('✅ Sample translation:', translationsResponse.data[0]);
    } else {
      console.log('⚠️ No translations found in database');
    }

    console.log('\n🎉 Backend API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Backend server is not running. Please start it with: npm start');
    } else if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testBackend();