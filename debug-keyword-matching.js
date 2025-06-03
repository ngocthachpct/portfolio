// Debug keyword matching logic
function testKeywordMatching() {
  console.log('🔍 Testing keyword matching logic...\n');
  
  const message = 'chuyển tới projects';
  const lowerMessage = message.toLowerCase();
  
  console.log(`Testing message: "${message}"`);
  console.log(`Lowercase: "${lowerMessage}"`);
  
  // Test navigation keywords
  const navigationKeywords = [
    'đi tới projects', 'go to projects', 'navigate to projects', 'chuyển tới projects',
    'vào trang projects', 'mở projects', 'project page', 'dự án page'
  ];
  
  console.log('\n📝 Testing navigation keywords:');
  navigationKeywords.forEach(keyword => {
    const matches = lowerMessage.includes(keyword);
    console.log(`  "${keyword}" → ${matches ? '✅' : '❌'}`);
  });
  
  // Test project keywords  
  const projectKeywords = [
    'dự án', 'project', 'portfolio', 'work', 'demo', 'github', 'source code',
    'ứng dụng', 'website', 'app', 'làm gì', 'build', 'phát triển', 'technology',
    'repository', 'repo', 'code', 'show me', 'best project'
  ];
  
  console.log('\n📝 Testing project keywords:');
  projectKeywords.forEach(keyword => {
    const matches = lowerMessage.includes(keyword);
    if (matches) {
      console.log(`  "${keyword}" → ✅ (MATCH!)`);
    }
  });
  
  // Show the issue
  console.log('\n🔍 Analysis:');
  const navigationMatch = navigationKeywords.some(keyword => lowerMessage.includes(keyword));
  const projectMatch = projectKeywords.some(keyword => lowerMessage.includes(keyword));
  
  console.log(`Navigation keywords match: ${navigationMatch}`);
  console.log(`Project keywords match: ${projectMatch}`);
  console.log(`\nThe issue is that both match, but navigation should have priority!`);
}

testKeywordMatching();
