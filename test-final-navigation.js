// Comprehensive navigation test including theme switching
const testCases = [
  // Navigation tests
  { message: 'tới trang chủ', expectNavigation: '/', expectIntent: 'navigate_home' },
  { message: 'go to about', expectNavigation: '/about', expectIntent: 'navigate_about' },
  { message: 'chuyển tới projects', expectNavigation: '/projects', expectIntent: 'navigate_projects' },
  { message: 'vào trang blog', expectNavigation: '/blog', expectIntent: 'navigate_blog' },
  { message: 'go to contact', expectNavigation: '/contact', expectIntent: 'navigate_contact' },
  { message: 'navigate to home', expectNavigation: '/', expectIntent: 'navigate_home' },
  { message: 'about page', expectNavigation: '/about', expectIntent: 'navigate_about' },
  
  // Theme tests
  { message: 'bật dark mode', expectTheme: 'dark', expectIntent: 'theme_dark' },
  { message: 'turn on light mode', expectTheme: 'light', expectIntent: 'theme_light' },
  { message: 'chế độ tự động', expectTheme: 'system', expectIntent: 'theme_system' },
  
  // Regular chatbot tests
  { message: 'Hello', expectNavigation: null, expectTheme: null, expectIntent: 'greeting' },
  { message: 'projects', expectNavigation: null, expectTheme: null, expectIntent: 'projects' },
  { message: 'skills', expectNavigation: null, expectTheme: null, expectIntent: 'skills' }
];

async function runComprehensiveNavigationTest() {
  console.log('🚀 Running Comprehensive Navigation + Theme Test...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of testCases) {
    try {
      console.log(`📝 Testing: "${test.message}"`);
      
      const response = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: test.message,
          sessionId: `nav_comprehensive_${Date.now()}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check intent
        const intentMatch = data.intent === test.expectIntent;
        
        // Check navigation action
        const navigationMatch = test.expectNavigation ? 
          data.navigationAction === test.expectNavigation : 
          !data.navigationAction;
        
        // Check theme action
        const themeMatch = test.expectTheme ? 
          data.themeAction === test.expectTheme : 
          !data.themeAction;
        
        // Check response quality
        const hasResponse = data.response && data.response.length > 10;
        
        if (intentMatch && navigationMatch && themeMatch && hasResponse) {
          console.log(`   ✅ PASS`);
          console.log(`      Intent: ${data.intent}`);
          console.log(`      Navigation: ${data.navigationAction || 'none'}`);
          console.log(`      Theme: ${data.themeAction || 'none'}`);
          console.log(`      Source: ${data.source}`);
          passed++;
        } else {
          console.log(`   ❌ FAIL`);
          console.log(`      Expected Intent: ${test.expectIntent}, Got: ${data.intent}`);
          console.log(`      Expected Navigation: ${test.expectNavigation || 'none'}, Got: ${data.navigationAction || 'none'}`);
          console.log(`      Expected Theme: ${test.expectTheme || 'none'}, Got: ${data.themeAction || 'none'}`);
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
    console.log('🎉 ALL FUNCTIONALITY WORKING PERFECTLY!');
    console.log('✅ Navigation commands: Working');
    console.log('✅ Theme switching: Working');
    console.log('✅ Regular chatbot: Working');
    console.log('✅ Intent detection: Working');
    console.log('✅ API responses: Working');
    console.log('\n🚀 The chatbot can now:');
    console.log('   • Switch themes when asked');
    console.log('   • Navigate to different pages');
    console.log('   • Provide informational responses');
    console.log('   • Handle mixed Vietnamese/English commands');
  } else {
    console.log(`⚠️  ${failed} tests failed`);
  }
}

runComprehensiveNavigationTest().catch(console.error);
