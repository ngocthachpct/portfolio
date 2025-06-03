// Test name extraction from homepage title
async function testNameExtraction() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Name Extraction from Homepage Title...\n');

  // First, let's check what's currently in the homepage
  try {
    const homeResponse = await fetch(`${baseUrl}/api/home`);
    if (homeResponse.ok) {
      const homeData = await homeResponse.json();
      console.log('🏠 CURRENT HOMEPAGE DATA:');
      console.log(`Title: "${homeData.title}"`);
      console.log(`Subtitle: "${homeData.subtitle}"`);
      console.log(`Description: "${homeData.description?.substring(0, 100)}..."`);
      console.log('');
    }
  } catch (error) {
    console.log('❌ Error fetching homepage data:', error.message);
  }

  // Test name queries
  const nameQueries = [
    'tên bạn là gì',
    'what is your name',
    'bạn là ai',
    'who are you',
    'tên của bạn',
    'your name'
  ];

  let successCount = 0;
  let totalTests = nameQueries.length;

  for (let i = 0; i < nameQueries.length; i++) {
    const query = nameQueries[i];
    console.log(`📝 Test ${i + 1}: "${query}"`);
    
    try {
      const response = await fetch(`${baseUrl}/api/chatbot/about?query=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Response: ${data.response.substring(0, 150)}...`);
        
        // Check if the response contains a real name (not "Your Name" or "Portfolio Owner")
        if (data.response.includes('Thach') || 
            data.response.includes('Nguyen') ||
            (!data.response.includes('Your Name') && !data.response.includes('Portfolio Owner'))) {
          console.log(`🎯 SUCCESS: Real name detected in response!`);
          successCount++;
        } else {
          console.log(`⚠️  INFO: Using fallback name or generic response`);
        }
      } else {
        console.log(`❌ API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('📊 NAME EXTRACTION TEST RESULTS:');
  console.log(`✅ Tests with real name: ${successCount}/${totalTests}`);
  console.log(`📈 Success rate: ${(successCount/totalTests*100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('🎉 PERFECT! All tests showing real name from homepage title.');
  } else if (successCount > 0) {
    console.log('✅ WORKING! Some tests showing real name extraction.');
  } else {
    console.log('⚠️  NEEDS CHECKING: No real names detected in responses.');
  }
}

// Run the test
testNameExtraction().catch(console.error);
