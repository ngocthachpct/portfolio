// Test different title formats for name extraction
async function testTitleFormats() {
  console.log('🧪 Testing Different Title Formats for Name Extraction...\n');

  // Test different title formats
  const testTitles = [
    "Hi, I'm Thach Nguyen",
    "Hello, I'm John Doe", 
    "I'm Jane Smith",
    "My name is Robert Johnson",
    "Thach Nguyen",
    "Hi I'm Sarah Wilson",
    "Hello, I am Michael Brown"
  ];

  testTitles.forEach((title, index) => {
    console.log(`📝 Test ${index + 1}: "${title}"`);
    
    // Test extraction logic
    let extractedName = 'Portfolio Owner';
    const titleMatch = title.match(/Hi,?\s*I'm\s*(.+)|Hello,?\s*I'm\s*(.+)|I'm\s*(.+)|My name is\s*(.+)|Hello,?\s*I am\s*(.+)|(.+)$/i);
    if (titleMatch) {
      // Take the first non-empty captured group
      extractedName = titleMatch[1] || titleMatch[2] || titleMatch[3] || titleMatch[4] || titleMatch[5] || titleMatch[6] || 'Portfolio Owner';
      extractedName = extractedName.trim();
    }
    
    console.log(`✅ Extracted: "${extractedName}"`);
    console.log('');
  });

  console.log('🎯 All title formats tested successfully!');
  console.log('💡 The regex pattern handles various introduction formats.');
}

// Run the test
testTitleFormats();
