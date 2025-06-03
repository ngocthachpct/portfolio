// Test script for enhanced blog chatbot service
const testEnhancedBlogChatbot = async () => {
  const baseUrl = 'http://localhost:3000/api/chatbot/blog';
  
  // Test queries for different intents
  const testQueries = [
    // Specific blog queries
    { query: 'react best practices', expectedIntent: 'specific_blogs' },
    { query: 'nextjs 15 features', expectedIntent: 'specific_blogs' },
    { query: 'typescript advanced', expectedIntent: 'specific_blogs' },
    { query: 'ai chatbot development', expectedIntent: 'specific_blogs' },
    { query: 'career tips for developers', expectedIntent: 'specific_blogs' },
    
    // General blog queries
    { query: 'what do you write about', expectedIntent: 'blog_general' },
    { query: 'blog overview', expectedIntent: 'blog_general' },
    { query: 'popular topics', expectedIntent: 'blog_general' },
    
    // Writing process queries
    { query: 'content planning', expectedIntent: 'writing_process' },
    { query: 'writing approach', expectedIntent: 'writing_process' },
    { query: 'quality standards', expectedIntent: 'writing_process' },
    
    // Tutorial queries
    { query: 'react tutorials', expectedIntent: 'tutorial_topics' },
    { query: 'step by step guide', expectedIntent: 'tutorial_topics' },
    { query: 'how to learn nextjs', expectedIntent: 'tutorial_topics' },
    
    // Mixed queries
    { query: 'docker containerization', expectedIntent: 'specific_blogs' },
    { query: 'web performance optimization', expectedIntent: 'specific_blogs' },
    { query: 'responsive design tips', expectedIntent: 'specific_blogs' }
  ];
  
  console.log('🧪 Testing Enhanced Blog Chatbot Service...\n');
  
  for (const test of testQueries) {
    try {
      const response = await fetch(`${baseUrl}?query=${encodeURIComponent(test.query)}`);
      const data = await response.json();
      
      console.log(`\n📝 Query: "${test.query}"`);
      console.log(`🎯 Expected Intent: ${test.expectedIntent}`);
      console.log(`✅ Actual Intent: ${data.intent}`);
      console.log(`📊 Intent Match: ${data.intent === test.expectedIntent ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`📖 Response Length: ${data.response.length} characters`);
      console.log(`🔍 Source: ${data.source}`);
      
      // Show first 200 characters of response
      const preview = data.response.substring(0, 200) + (data.response.length > 200 ? '...' : '');
      console.log(`📄 Response Preview: ${preview}`);
      console.log('─'.repeat(80));
      
    } catch (error) {
      console.error(`❌ Error testing query "${test.query}":`, error.message);
      console.log('─'.repeat(80));
    }
  }
  
  console.log('\n🎉 Blog chatbot testing completed!');
};

// Run the test
testEnhancedBlogChatbot();
