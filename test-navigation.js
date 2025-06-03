// Test navigation functionality of chatbot
const testNavigationCommands = [
  // Vietnamese navigation commands
  { message: "đi tới trang chủ", expectedRedirect: "/" },
  { message: "chuyển tới about", expectedRedirect: "/about" },
  { message: "tới trang dự án", expectedRedirect: "/projects" },
  { message: "vào trang blog", expectedRedirect: "/blog" },
  { message: "mở trang liên hệ", expectedRedirect: "/contact" },
  
  // English navigation commands
  { message: "go to home", expectedRedirect: "/" },
  { message: "navigate to about", expectedRedirect: "/about" },
  { message: "visit projects", expectedRedirect: "/projects" },
  { message: "go to blog", expectedRedirect: "/blog" },
  { message: "navigate to contact", expectedRedirect: "/contact" },
  
  // Direct page requests
  { message: "trang chủ", expectedRedirect: "/" },
  { message: "xem dự án", expectedRedirect: "/projects" },
  { message: "đọc blog", expectedRedirect: "/blog" },
  { message: "form liên hệ", expectedRedirect: "/contact" },
  
  // Non-navigation commands (should not redirect)
  { message: "xin chào", expectedRedirect: null },
  { message: "kỹ năng của bạn", expectedRedirect: null },
  { message: "giới thiệu về bạn", expectedRedirect: null }
];

async function testChatbotNavigation() {
  console.log("🧭 TESTING CHATBOT NAVIGATION FUNCTIONALITY");
  console.log("===========================================\n");

  for (const test of testNavigationCommands) {
    try {
      console.log(`📝 Testing: "${test.message}"`);
      
      const response = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: test.message,
          sessionId: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        console.log(`🎯 Intent: ${data.intent}`);
        console.log(`📍 Redirect: ${data.redirectTo || 'None'}`);
        console.log(`💬 Response: ${data.response.substring(0, 100)}...`);
        
        // Check if redirect matches expected
        if (test.expectedRedirect === data.redirectTo) {
          console.log(`✅ PASS - Redirect matches expected`);
        } else {
          console.log(`❌ FAIL - Expected: ${test.expectedRedirect}, Got: ${data.redirectTo}`);
        }
        
        console.log(`📊 Confidence: ${(data.confidence * 100).toFixed(1)}%`);
        console.log(`🔧 Source: ${data.source}`);
        
      } else {
        console.log(`❌ API Error: ${response.status}`);
      }
      
      console.log("─".repeat(60));
      
    } catch (error) {
      console.error(`❌ Error testing "${test.message}":`, error.message);
      console.log("─".repeat(60));
    }
  }

  console.log("\n🎉 Navigation testing completed!");
}

// Run the test
testChatbotNavigation().catch(console.error);
