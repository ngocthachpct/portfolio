// Test theme switching functionality through chatbot
const testThemeSwitching = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Theme Switching Functionality...\n');

  // Test cases for theme switching
  const testCases = [
    {
      message: "bật dark mode",
      expectedIntent: "theme_dark",
      expectedThemeAction: "dark",
      description: "Vietnamese dark mode command"
    },
    {
      message: "turn on light mode",
      expectedIntent: "theme_light", 
      expectedThemeAction: "light",
      description: "English light mode command"
    },
    {
      message: "chế độ tự động",
      expectedIntent: "theme_system",
      expectedThemeAction: "system", 
      description: "Vietnamese system mode command"
    },
    {
      message: "switch to dark",
      expectedIntent: "theme_dark",
      expectedThemeAction: "dark",
      description: "English dark mode switch"
    },
    {
      message: "đổi sang sáng",
      expectedIntent: "theme_light",
      expectedThemeAction: "light",
      description: "Vietnamese light mode switch"
    },
    {
      message: "system theme",
      expectedIntent: "theme_system", 
      expectedThemeAction: "system",
      description: "English system theme"
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`📝 Test ${i + 1}/${totalTests}: ${testCase.description}`);
    console.log(`   Input: "${testCase.message}"`);

    try {
      const response = await fetch(`${baseUrl}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.message,
          sessionId: `test_session_${Date.now()}`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        console.log(`   Intent detected: ${data.intent}`);
        console.log(`   Theme action: ${data.themeAction || 'none'}`);
        console.log(`   Response: ${data.response.substring(0, 100)}...`);

        // Check if intent matches expected
        const intentMatch = data.intent === testCase.expectedIntent;
        const themeActionMatch = data.themeAction === testCase.expectedThemeAction;
        const hasResponse = data.response && data.response.length > 0;

        if (intentMatch && themeActionMatch && hasResponse) {
          console.log(`   ✅ PASSED - Intent: ${intentMatch}, ThemeAction: ${themeActionMatch}, Response: ${hasResponse}\n`);
          passedTests++;
        } else {
          console.log(`   ❌ FAILED - Intent: ${intentMatch}, ThemeAction: ${themeActionMatch}, Response: ${hasResponse}`);
          console.log(`   Expected intent: ${testCase.expectedIntent}, got: ${data.intent}`);
          console.log(`   Expected themeAction: ${testCase.expectedThemeAction}, got: ${data.themeAction}\n`);
        }
      } else {
        console.log(`   ❌ FAILED - HTTP ${response.status}: ${response.statusText}\n`);
      }
    } catch (error) {
      console.log(`   ❌ FAILED - Error: ${error.message}\n`);
    }

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All theme switching tests passed!');
  } else {
    console.log(`⚠️  ${totalTests - passedTests} tests failed`);
  }

  // Test general theme usage detection
  console.log('\n🔍 Testing general theme usage detection...');
  
  try {
    const response = await fetch(`${baseUrl}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "how do I change the theme?",
        sessionId: `test_session_${Date.now()}`
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Intent: ${data.intent}`);
      console.log(`Theme action: ${data.themeAction || 'none'}`);
      
      if (data.intent === 'theme_usage' && !data.themeAction) {
        console.log('✅ General theme usage detection works correctly');
      } else {
        console.log('❌ General theme usage detection failed');
      }
    }
  } catch (error) {
    console.log(`❌ Error testing general theme usage: ${error.message}`);
  }

  console.log('\n✨ Theme switching test completed!');
};

// Run the test
testThemeSwitching().catch(console.error);
