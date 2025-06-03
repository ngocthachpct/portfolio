// Test improved router for owner-specific queries
async function testImprovedRouter() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔧 Testing Improved Router for Owner Queries...\n');

  // Test owner-specific queries
  const ownerQueries = [
    'tên bạn là gì',
    'who are you', 
    'bạn là ai',
    'personal information',
    'thông tin cá nhân',
    'giới thiệu về bạn'
  ];

  let successCount = 0;
  let totalTests = ownerQueries.length;

  for (let i = 0; i < ownerQueries.length; i++) {
    const query = ownerQueries[i];
    console.log(`📝 Test ${i + 1}: "${query}"`);
    
    try {
      const response = await fetch(`${baseUrl}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Intent: ${data.intent}`);
        console.log(`📊 Confidence: ${data.confidence}`);
        console.log(`🔧 Source: ${data.source}`);
        console.log(`📝 Response: ${data.response.substring(0, 80)}...`);
        
        // Check if it correctly routes to about service
        if (data.intent === 'about' && data.source === 'about_service') {
          console.log(`🎯 SUCCESS: Correctly routed to about service!`);
          successCount++;
        } else {
          console.log(`⚠️  ROUTING ISSUE: Intent=${data.intent}, Source=${data.source}`);
        }
      } else {
        console.log(`❌ API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('📊 ROUTER TEST RESULTS:');
  console.log(`✅ Correctly routed: ${successCount}/${totalTests}`);
  console.log(`📈 Success rate: ${(successCount/totalTests*100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('🎉 PERFECT ROUTING! All owner queries properly routed to about service.');
  } else if (successCount > totalTests * 0.7) {
    console.log('✅ GOOD ROUTING! Most queries properly routed.');
  } else {
    console.log('⚠️  NEEDS IMPROVEMENT: Routing accuracy could be better.');
  }
}

// Run the test
testImprovedRouter().catch(console.error);
