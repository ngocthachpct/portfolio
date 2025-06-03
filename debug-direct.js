// Direct test of detectIntent function
import ChatbotIntentRouter from './src/lib/chatbot-router-fixed.js';

const testDirectDetection = () => {
  const testCases = [
    "dark mode",
    "bật dark mode", 
    "turn on light mode",
    "theme",
    "chế độ tự động",
    "switch to dark"
  ];

  console.log('🧪 Direct Intent Detection Test...\n');

  testCases.forEach(message => {
    const intent = ChatbotIntentRouter.detectIntent(message);
    console.log(`"${message}" → ${intent}`);
  });
};

testDirectDetection();
