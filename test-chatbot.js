// Test script for chatbot routes
const BASE_URL = 'http://localhost:3000/api/chatbot';

const testQueries = [
  // Projects tests
  { query: 'Tell me about your projects', expectedRoute: 'projects' },
  { query: 'What technologies do you use in your projects?', expectedRoute: 'projects' },
  { query: 'Show me your GitHub repositories', expectedRoute: 'projects' },
  
  // About tests  
  { query: 'Tell me about yourself', expectedRoute: 'about' },
  { query: 'What is your background?', expectedRoute: 'about' },
  { query: 'What are your core values?', expectedRoute: 'about' },
  
  // Skills tests
  { query: 'What are your skills?', expectedRoute: 'skills' },
  { query: 'What programming languages do you know?', expectedRoute: 'skills' },
  { query: 'Tell me about your technical expertise', expectedRoute: 'skills' },
  
  // Contact tests
  { query: 'How can I contact you?', expectedRoute: 'contact' },
  { query: 'What is your email address?', expectedRoute: 'contact' },
  { query: 'How do you prefer to communicate?', expectedRoute: 'contact' },
  
  // Blog tests
  { query: 'Do you write any blogs?', expectedRoute: 'blog' },
  { query: 'What tutorials have you written?', expectedRoute: 'blog' },
  { query: 'Share some of your latest articles', expectedRoute: 'blog' }
];

async function testRoute(endpoint, query) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return {
      success: response.ok,
      data,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function testMainChatbot(message) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    return {
      success: response.ok,
      data,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🚀 Testing Chatbot Routes...\n');
  
  // Test individual routes
  console.log('📋 Testing Individual Routes:');
  const routes = ['projects', 'about', 'skills', 'contact', 'blog'];
  
  for (const route of routes) {
    console.log(`\n🔍 Testing ${route} route:`);
    const testQuery = `Tell me about ${route}`;
    const result = await testRoute(route, testQuery);
    
    if (result.success) {
      console.log(`✅ ${route}: ${result.data.response.substring(0, 100)}...`);
      console.log(`   Intent: ${result.data.intent}, Source: ${result.data.source}`);
    } else {
      console.log(`❌ ${route}: Error - ${result.error || result.status}`);
    }
  }
  
  // Test main chatbot with routing
  console.log('\n\n📋 Testing Main Chatbot with Routing:');
  
  for (const test of testQueries.slice(0, 5)) { // Test first 5 queries
    console.log(`\n🔍 Testing: "${test.query}"`);
    const result = await testMainChatbot(test.query);
    
    if (result.success) {
      console.log(`✅ Intent: ${result.data.intent}, Source: ${result.data.source}`);
      console.log(`   Response: ${result.data.response.substring(0, 120)}...`);
      console.log(`   Confidence: ${result.data.confidence}, Time: ${result.data.responseTime}ms`);
    } else {
      console.log(`❌ Error: ${result.error || result.status}`);
    }
  }
  
  console.log('\n✨ Testing completed!');
}

// Run tests
runTests().catch(console.error);
