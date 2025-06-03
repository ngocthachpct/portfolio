// Test name extraction from homepage title
async function testNameExtraction() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Name Extraction from Homepage Title...\n');

  // First, check what's currently in the database
  console.log('📊 Checking current homepage content...');
  try {
    const homeResponse = await fetch(`${baseUrl}/api/home`);
    if (homeResponse.ok) {
      const homeData = await homeResponse.json();
      console.log(`Current title: "${homeData.title}"`);
      console.log(`Current subtitle: "${homeData.subtitle}"`);
      
      // Test name extraction logic
      let extractedName = 'Portfolio Owner';
      if (homeData.title) {
        const titleMatch = homeData.title.match(/Hi,?\s*I'm\s*(.+)|I'm\s*(.+)|My name is\s*(.+)|(.+)$/i);
        if (titleMatch) {
          extractedName = titleMatch[1] || titleMatch[2] || titleMatch[3] || titleMatch[4] || 'Portfolio Owner';
          extractedName = extractedName.trim();
        }
      }
      console.log(`📝 Extracted name: "${extractedName}"`);
    }
  } catch (error) {
    console.error('Error fetching home data:', error);
  }

  console.log('\n🎯 Testing chatbot name queries...');
  
  const nameQueries = [
    'tên bạn là gì',
    'what is your name',
    'bạn là ai', 
    'who are you',
    'giới thiệu tên của bạn'
  ];

  let successCount = 0;
  let totalTests = nameQueries.length;

  for (let i = 0; i < nameQueries.length; i++) {
    const query = nameQueries[i];
    console.log(`\n📝 Test ${i + 1}: "${query}"`);
    
    try {
      const response = await fetch(`${baseUrl}/api/chatbot/about?query=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Response: ${data.response.substring(0, 150)}...`);
        
        // Check if response contains extracted name (not "Your Name" or "Portfolio Owner")
        if (!data.response.includes('Your Name') && 
            !data.response.includes('Portfolio Owner') &&
            data.response.includes('**Tên:**')) {
          console.log(`🎯 SUCCESS: Using extracted name from homepage title!`);
          successCount++;
        } else if (data.response.includes('Your Name')) {
          console.log(`⚠️  STILL USING: "Your Name" - title might need to be updated`);
        } else {
          console.log(`🔍 CHECKING: Response format may have changed`);
        }
      } else {
        console.log(`❌ API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n📊 NAME EXTRACTION TEST RESULTS:');
  console.log(`✅ Tests using extracted name: ${successCount}/${totalTests}`);
  console.log(`📈 Success rate: ${(successCount/totalTests*100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('🎉 PERFECT! Name extraction from homepage title working correctly!');
  } else {
    console.log('💡 TIP: Update homepage title via /admin/home to see extracted name in chatbot');
    console.log('Example: "Hi, I\'m Thach Nguyen" will extract "Thach Nguyen"');
  }
}

// Run the test
testNameExtraction().catch(console.error);
