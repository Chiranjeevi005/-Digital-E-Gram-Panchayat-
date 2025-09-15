async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test the base endpoint
    const baseResponse = await fetch('http://localhost:3002/api');
    console.log('Base endpoint status:', baseResponse.status);
    
    // Test the auth user endpoint without token
    const authResponse = await fetch('http://localhost:3002/api/auth/user/me');
    console.log('Auth endpoint status (no token):', authResponse.status);
    
    console.log('API tests completed');
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI();