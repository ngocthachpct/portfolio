// Test script for enhanced chatbot project responses
const testQueries = [
  {
    query: "Bạn có những dự án gì?",
    expected: "general project list"
  },
  {
    query: "cho tôi thông tin về dự án Weather Dashboard",
    expected: "specific weather dashboard details"
  },
  {
    query: "portfolio website",
    expected: "specific portfolio details"
  },
  {
    query: "e-commerce platform",
    expected: "specific e-commerce details"
  },
  {
    query: "task management app",
    expected: "specific task management details"
  },
  {
    query: "social media app",
    expected: "specific social media details"
  }
];

async function testChatbot() {
  console.log("🚀 Testing Enhanced Chatbot Project Responses...\n");
  
  for (const test of testQueries) {
    try {
      const response = await fetch(`http://localhost:3000/api/chatbot/projects?query=${encodeURIComponent(test.query)}`);
      const data = await response.json();
      
      console.log(`📝 Query: "${test.query}"`);
      console.log(`📋 Intent: ${data.intent}`);
      console.log(`🎯 Response: ${data.response.substring(0, 100)}...`);
      console.log(`✅ Expected: ${test.expected}`);
      console.log("─".repeat(80));
    } catch (error) {
      console.error(`❌ Error testing "${test.query}":`, error.message);
    }
  }
}

// Wait for server to be ready then test
setTimeout(testChatbot, 3000);
