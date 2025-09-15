const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAuthFlow() {
  console.log('Testing Authentication Flow...\n');
  
  // Test 1: Register a new citizen
  console.log('1. Testing Citizen Registration...');
  try {
    const registerResponse = await fetch('http://localhost:3002/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Citizen',
        email: 'testcitizen@example.com',
        password: 'password123'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Register Response:', registerData);
    
    if (registerResponse.ok) {
      console.log('✓ Citizen registration successful\n');
      
      // Test 2: Login as citizen
      console.log('2. Testing Citizen Login...');
      const loginResponse = await fetch('http://localhost:3002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'testcitizen@example.com',
          password: 'password123',
          userType: 'Citizen'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login Response:', loginData);
      
      if (loginResponse.ok) {
        console.log('✓ Citizen login successful\n');
        
        // Test 3: Get current user
        console.log('3. Testing Get Current User...');
        const userResponse = await fetch('http://localhost:3002/api/auth/user/me', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });
        
        const userData = await userResponse.json();
        console.log('User Response:', userData);
        
        if (userResponse.ok) {
          console.log('✓ Get current user successful\n');
        }
      }
    }
  } catch (error) {
    console.error('Error during citizen auth flow:', error.message);
  }
  
  // Test 4: Officer login
  console.log('4. Testing Officer Login...');
  try {
    const officerLoginResponse = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'officer@epanchayat.com',
        password: 'password123',
        userType: 'Officer'
      })
    });
    
    const officerLoginData = await officerLoginResponse.json();
    console.log('Officer Login Response:', officerLoginData);
    
    if (officerLoginResponse.ok) {
      console.log('✓ Officer login successful\n');
    }
  } catch (error) {
    console.error('Error during officer login:', error.message);
  }
  
  // Test 5: Staff login
  console.log('5. Testing Staff Login...');
  try {
    const staffLoginResponse = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'staff1@epanchayat.com',
        password: 'password123',
        userType: 'Staff'
      })
    });
    
    const staffLoginData = await staffLoginResponse.json();
    console.log('Staff Login Response:', staffLoginData);
    
    if (staffLoginResponse.ok) {
      console.log('✓ Staff login successful\n');
    }
  } catch (error) {
    console.error('Error during staff login:', error.message);
  }
  
  console.log('Authentication flow test completed.');
}

testAuthFlow();