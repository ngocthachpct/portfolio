// Performance test for improved chatbot with caching
const TEST_QUERIES = [
  // Test cache hits with repeated queries
  { query: "Tell me about your projects", expectedIntent: "projects", repeat: 3 },
  { query: "What are your skills?", expectedIntent: "skills", repeat: 3 },
  { query: "Tell me about yourself", expectedIntent: "about", repeat: 2 },
  { query: "How can I contact you?", expectedIntent: "contact", repeat: 2 },
  { query: "Do you write blogs?", expectedIntent: "blog", repeat: 2 },
  
  // Test similar queries (should hit similarity cache)
  { query: "Show me your projects", expectedIntent: "projects" },
  { query: "What projects have you built?", expectedIntent: "projects" },
  { query: "What technical skills do you have?", expectedIntent: "skills" },
  { query: "Tell me your programming skills", expectedIntent: "skills" },
  { query: "What's your background?", expectedIntent: "about" },
  { query: "What's your professional experience?", expectedIntent: "about" },
];

async function performanceTest() {
  console.log('🎯 Performance Test - Chatbot with Caching');
  console.log('='.repeat(50));
  
  let totalTests = 0;
  let totalTime = 0;
  let cacheHits = 0;
  let cacheMisses = 0;
  
  const results = [];
  
  for (const testCase of TEST_QUERIES) {
    const repeats = testCase.repeat || 1;
    
    for (let i = 0; i < repeats; i++) {
      totalTests++;
      
      try {
        const startTime = Date.now();
        
        const response = await fetch('http://localhost:3000/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: testCase.query,
            sessionId: `perf_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          })
        });
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        totalTime += responseTime;
        
        const data = await response.json();
        
        const isCached = data.source?.includes('cached') || data.cached;
        if (isCached) {
          cacheHits++;
        } else {
          cacheMisses++;
        }
        
        const result = {
          query: testCase.query,
          iteration: i + 1,
          responseTime,
          intent: data.intent,
          expectedIntent: testCase.expectedIntent,
          isCached,
          source: data.source,
          success: response.ok && data.intent === testCase.expectedIntent
        };
        
        results.push(result);
        
        const cacheIcon = isCached ? '📦' : '🔍';
        const successIcon = result.success ? '✅' : '❌';
        
        console.log(`${successIcon} ${cacheIcon} Test ${totalTests}: "${testCase.query}" (${i + 1}/${repeats})`);
        console.log(`   ⚡ Time: ${responseTime}ms | Intent: ${data.intent} | ${isCached ? 'CACHE HIT' : 'CACHE MISS'}`);
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Test failed: ${testCase.query}`, error.message);
      }
    }
  }
  
  // Calculate statistics
  const avgResponseTime = Math.round(totalTime / totalTests);
  const cacheHitRate = Math.round((cacheHits / totalTests) * 100);
  const successRate = Math.round((results.filter(r => r.success).length / totalTests) * 100);
  
  const cachedResponseTimes = results.filter(r => r.isCached).map(r => r.responseTime);
  const uncachedResponseTimes = results.filter(r => !r.isCached).map(r => r.responseTime);
  
  const avgCachedTime = cachedResponseTimes.length > 0 ? 
    Math.round(cachedResponseTimes.reduce((a, b) => a + b, 0) / cachedResponseTimes.length) : 0;
  const avgUncachedTime = uncachedResponseTimes.length > 0 ? 
    Math.round(uncachedResponseTimes.reduce((a, b) => a + b, 0) / uncachedResponseTimes.length) : 0;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 PERFORMANCE RESULTS:');
  console.log('='.repeat(50));
  console.log(`🎯 Total Tests: ${totalTests}`);
  console.log(`✅ Success Rate: ${successRate}%`);
  console.log(`⚡ Average Response Time: ${avgResponseTime}ms`);
  console.log(`📦 Cache Hit Rate: ${cacheHitRate}% (${cacheHits}/${totalTests})`);
  console.log(`🔍 Cache Miss Rate: ${100 - cacheHitRate}% (${cacheMisses}/${totalTests})`);
  console.log(`🚀 Cached Avg Time: ${avgCachedTime}ms`);
  console.log(`🐌 Uncached Avg Time: ${avgUncachedTime}ms`);
  
  if (avgCachedTime && avgUncachedTime) {
    const speedImprovement = Math.round(((avgUncachedTime - avgCachedTime) / avgUncachedTime) * 100);
    console.log(`⚡ Speed Improvement: ${speedImprovement}% faster with cache`);
  }
  
  // Performance analysis
  console.log('\n📈 PERFORMANCE ANALYSIS:');
  console.log('-'.repeat(30));
  if (cacheHitRate >= 50) {
    console.log('✅ Excellent cache performance - high hit rate');
  } else if (cacheHitRate >= 25) {
    console.log('⚠️ Moderate cache performance - room for improvement');
  } else {
    console.log('❌ Poor cache performance - cache optimization needed');
  }
  
  if (avgResponseTime <= 500) {
    console.log('✅ Excellent response times - under 500ms average');
  } else if (avgResponseTime <= 1000) {
    console.log('⚠️ Moderate response times - 500-1000ms average');
  } else {
    console.log('❌ Slow response times - over 1000ms average');
  }
  
  if (successRate >= 95) {
    console.log('✅ Excellent success rate - 95%+ accuracy');
  } else if (successRate >= 85) {
    console.log('⚠️ Good success rate - 85-95% accuracy');
  } else {
    console.log('❌ Poor success rate - under 85% accuracy');
  }
  
  // Cache statistics from server
  try {
    console.log('\n🗃️ SERVER CACHE STATS:');
    console.log('-'.repeat(25));
    
    // Note: Would need to add an endpoint to get cache stats
    console.log('Cache statistics would be displayed here if endpoint exists');
    
  } catch (error) {
    console.log('Unable to retrieve server cache statistics');
  }
  
  console.log('\n🎉 Performance test completed!');
  
  return {
    totalTests,
    successRate,
    avgResponseTime,
    cacheHitRate,
    avgCachedTime,
    avgUncachedTime,
    results
  };
}

// Run the performance test
performanceTest().catch(console.error);
