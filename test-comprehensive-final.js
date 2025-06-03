// Final comprehensive test combining theme and direct functionality
const comprehensiveTests = [
  // Theme switching tests
  { message: 'bật dark mode', expectTheme: 'dark', expectIntent: 'theme_dark' },
  { message: 'turn on light mode', expectTheme: 'light', expectIntent: 'theme_light' },
  { message: 'chế độ tự động', expectTheme: 'system', expectIntent: 'theme_system' },
  { message: 'theme', expectTheme: null, expectIntent: 'theme_usage' },
  
  // Direct response tests
  { message: 'Hello', expectTheme: null, expectIntent: 'greeting' },
  { message: 'dự án', expectTheme: null, expectIntent: 'projects' },
  { message: 'skills', expectTheme: null, expectIntent: 'skills' },
  { message: 'contact', expectTheme: null, expectIntent: 'contact' },
  { message: 'about', expectTheme: null, expectIntent: 'about' },
  { message: 'blog', expectTheme: null, expectIntent: 'blog' },
  
  // Mixed tests
  { message: 'What are your projects?', expectTheme: null, expectIntent: 'projects' },
  { message: 'đổi sang dark theme', expectTheme: 'dark', expectIntent: 'theme_dark' },
  { message: 'kỹ năng của bạn', expectTheme: null, expectIntent: 'skills' }
];

async function runComprehensiveTest() {
  console.log('🎯 Running Final Comprehensive Test...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of comprehensiveTests) {
    try {
      console.log(`📝 Testing: "${test.message}"`);
      
      const response = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: test.message,
          sessionId: `comprehensive_${Date.now()}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check intent
        const intentMatch = data.intent === test.expectIntent;
        
        // Check theme action
        const themeMatch = test.expectTheme ? 
          data.themeAction === test.expectTheme : 
          !data.themeAction;
        
        // Check response quality
        const hasResponse = data.response && data.response.length > 10;
        
        if (intentMatch && themeMatch && hasResponse) {
          console.log(`   ✅ PASS - Intent: ${data.intent}, Theme: ${data.themeAction || 'none'}, Source: ${data.source}`);
          passed++;
        } else {
          console.log(`   ❌ FAIL - Expected intent: ${test.expectIntent}, got: ${data.intent}`);
          console.log(`           Expected theme: ${test.expectTheme || 'none'}, got: ${data.themeAction || 'none'}`);
          failed++;
        }
      } else {
        console.log(`   ❌ FAIL - HTTP Error: ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ FAIL - Error: ${error.message}`);
      failed++;
    }
    console.log('');
  }
  
  console.log(`📊 Final Results: ${passed}/${passed + failed} tests passed`);
  if (failed === 0) {
    console.log('🎉 All functionality working perfectly!');
    console.log('✅ Theme switching: Working');
    console.log('✅ Direct responses: Working');
    console.log('✅ Intent detection: Working');
    console.log('✅ Microservices: Working');
  } else {
    console.log(`⚠️  ${failed} tests failed`);
  }
}

runComprehensiveTest().catch(console.error);
