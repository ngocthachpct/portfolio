// Test script for dynamic owner information from database APIs
async function testDynamicOwnerInfo() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Dynamic Owner Information Retrieval...\n');

  // Test owner name queries
  const testQueries = [
    'Tên của bạn là gì?',
    'What is your name?', 
    'Bạn là ai?',
    'Who are you?',
    'Giới thiệu về bản thân',
    'Tell me about yourself',
    'Thông tin cá nhân',
    'Personal information',
    'Contact information',
    'Email liên hệ'
  ];

  let successCount = 0;
  let totalTests = testQueries.length;

  for (let i = 0; i < testQueries.length; i++) {
    const query = testQueries[i];
    console.log(`📝 Test ${i + 1}: "${query}"`);
    
    try {
      const response = await fetch(`${baseUrl}/api/chatbot/about?query=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Response: ${data.response.substring(0, 100)}...`);
        
        // Check if response contains dynamic information (not hardcoded "Ngô Công Thiên")
        if (data.response.includes('Portfolio Owner') || 
            !data.response.includes('Ngô Công Thiên') ||
            data.response.includes('API') ||
            data.response.includes('database')) {
          console.log(`🎯 SUCCESS: Using dynamic data source!`);
          successCount++;
        } else {
          console.log(`⚠️  WARNING: Might still be using hardcoded data`);
        }
      } else {
        console.log(`❌ API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('📊 FINAL RESULTS:');
  console.log(`✅ Successful tests: ${successCount}/${totalTests}`);
  console.log(`📈 Success rate: ${(successCount/totalTests*100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Dynamic owner info is working correctly.');
  } else if (successCount > totalTests * 0.7) {
    console.log('✅ MOSTLY WORKING! Some tests passed with dynamic data.');
  } else {
    console.log('⚠️  NEEDS ATTENTION: Most tests still showing hardcoded data.');
  }
}

// Run the test
testDynamicOwnerInfo().catch(console.error);
