// Quick test for owner info intent detection
const testOwnerInfoDetection = () => {
  // Simulate the detectIntent function
  function detectIntent(query) {
    const lowerQuery = query.toLowerCase();
    
    // Owner/Personal information related
    if (lowerQuery.includes('tên') || lowerQuery.includes('name') || 
        lowerQuery.includes('owner') || lowerQuery.includes('chủ sở hữu') ||
        lowerQuery.includes('bạn là ai') || lowerQuery.includes('who are you') ||
        lowerQuery.includes('giới thiệu') || lowerQuery.includes('introduce') ||
        lowerQuery.includes('cá nhân') || lowerQuery.includes('personal') ||
        lowerQuery.includes('sở thích') || lowerQuery.includes('hobby') ||
        lowerQuery.includes('địa điểm') || lowerQuery.includes('location') ||
        lowerQuery.includes('ở đâu') || lowerQuery.includes('where')) {
      return 'owner_info';
    }
    
    return 'other';
  }

  const testQueries = [
    'tên bạn là gì',
    'bạn là ai', 
    'giới thiệu về bạn',
    'chủ sở hữu website',
    'what is your name',
    'who are you',
    'introduce yourself',
    'personal information'
  ];

  console.log('🧪 Testing Owner Info Intent Detection:\n');
  
  testQueries.forEach(query => {
    const intent = detectIntent(query);
    const isOwnerInfo = intent === 'owner_info';
    console.log(`Query: "${query}" → Intent: ${intent} ${isOwnerInfo ? '✅' : '❌'}`);
  });
  
  console.log('\n✨ Intent detection test completed!');
};

testOwnerInfoDetection();
