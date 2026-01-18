const testUsersAPI = async () => {
  try {
    console.log('Testing Users API...');
    
    // Test GET /users
    const response = await fetch('https://metagym.metacodecx.com/api/v1/users?page=1&limit=50', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required auth headers here
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
      console.log('Users count:', data.data?.length || 0);
      console.log('First user:', data.data?.[0]);
    } else {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};

// Run the test
testUsersAPI();
