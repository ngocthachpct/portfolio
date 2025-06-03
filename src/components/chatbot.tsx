'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  conversationId?: string;
  messageId?: string;
  intent?: string;
  confidence?: number;
  source?: 'learned' | 'generated' | 'default';
  wasHelpful?: boolean;
}

interface ChatbotSize {
  width: number;
  height: number;
}

// Navigation intents that should trigger page redirects
const NAVIGATION_INTENTS = [
  'navigate_home',
  'navigate_about', 
  'navigate_projects',
  'navigate_blog',
  'navigate_contact'
];

// Page mapping for navigation
const PAGE_ROUTES = {
  'navigate_home': '/',
  'navigate_about': '/about',
  'navigate_projects': '/projects', 
  'navigate_blog': '/blog',
  'navigate_contact': '/contact'
} as const;

const CHATBOT_RESPONSES = {
  greeting: [
    "Xin chào! Tôi là chatbot hỗ trợ của portfolio này. Tôi có thể giúp bạn tìm hiểu về kỹ năng, dự án và kinh nghiệm của chủ sở hữu.",
    "Chào bạn! Tôi ở đây để trả lời các câu hỏi về portfolio này. Bạn muốn biết gì?",
  ],
  chatbot_introduction: [
    "🤖 Xin chào! Tôi là Portfolio Assistant - chatbot thông minh của website này! Tôi có thể giúp bạn tìm hiểu về background, projects, skills và career opportunities. Tôi cũng có thể điều hướng bạn đến các trang cụ thể. Hãy hỏi tôi bất cứ điều gì!",
    "🎯 Tôi là AI assistant được thiết kế để hỗ trợ visitors và recruiters! Có thể trả lời về technical skills, projects, experience và contact info. Plus, tôi có thể direct bạn đến trang bạn muốn xem. Bạn cần biết gì?",
  ],
  about: [
    "Đây là portfolio của một full-stack developer với kinh nghiệm trong React, Next.js, Node.js và các công nghệ web hiện đại.",
    "Portfolio này showcase các kỹ năng và dự án trong lĩnh vực phát triển web, từ frontend đến backend.",
  ],
  projects: [
    "Bạn có thể xem các dự án trong phần 'Projects'. Mỗi dự án đều có mô tả chi tiết, công nghệ sử dụng và link demo.",
    "Các dự án được trình bày với hình ảnh, mô tả và link đến source code hoặc demo trực tiếp.",
  ],
  skills: [
    "Kỹ năng chính bao gồm: React, Next.js, TypeScript, Node.js, Python, và các công nghệ web hiện đại khác.",
    "Chuyên môn về frontend development, backend API, database design và deployment.",
  ],
  contact: [
    "Bạn có thể liên hệ qua trang Contact hoặc theo thông tin trong phần Contact Information.",
    "Hãy điền form liên hệ và tin nhắn sẽ được gửi trực tiếp đến email.",
  ],
  default: [
    "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về các chủ đề: dự án, kỹ năng, kinh nghiệm, hoặc thông tin liên hệ.",
    "Tôi có thể giúp bạn tìm hiểu về portfolio này. Hãy thử hỏi về 'dự án', 'kỹ năng', hoặc 'liên hệ'.",
  ]
} as const;

const detectIntent = (message: string): keyof typeof CHATBOT_RESPONSES => {
  const lowerMessage = message.toLowerCase();
  
  // Chatbot self-introduction
  if (lowerMessage.includes('bạn là ai') || lowerMessage.includes('giới thiệu bản thân') || 
      lowerMessage.includes('who are you') || lowerMessage.includes('introduce yourself') ||
      lowerMessage.includes('tự giới thiệu') || lowerMessage.includes('bạn là gì') ||
      lowerMessage.includes('what are you') || lowerMessage.includes('tell me about yourself') ||
      lowerMessage.includes('chatbot') || lowerMessage.includes('ai assistant') ||
      lowerMessage.includes('trợ lý ảo') || (lowerMessage.includes('bot') && lowerMessage.includes('gì'))) {
    return 'chatbot_introduction';
  }
  
  if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'greeting';
  }
  if (lowerMessage.includes('dự án') || lowerMessage.includes('project')) {
    return 'projects';
  }
  if (lowerMessage.includes('kỹ năng') || lowerMessage.includes('skill') || lowerMessage.includes('công nghệ')) {
    return 'skills';
  }
  if (lowerMessage.includes('giới thiệu') || lowerMessage.includes('about') || lowerMessage.includes('thông tin')) {
    return 'about';
  }
  if (lowerMessage.includes('liên hệ') || lowerMessage.includes('contact')) {
    return 'contact';
  }
  
  return 'default';
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [chatbotSize, setChatbotSize] = useState<ChatbotSize>({
    width: 320,
    height: 448
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Generate session ID on component mount
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (text: string, data?: any) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      conversationId: data?.conversationId,
      messageId: data?.messageId,
      intent: data?.intent,
      confidence: data?.confidence,
      source: data?.source || 'default'
    };
    setMessages((prev: Message[]) => [...prev, botMessage]);
  };

  const handleFeedback = async (messageId: string, conversationId: string, helpful: boolean) => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          messageId,
          rating: helpful ? 5 : 1,
          feedbackType: helpful ? 'HELPFUL' : 'NOT_HELPFUL'
        }),
      });

      if (response.ok) {
        // Update message to show feedback was given
        setMessages((prev: Message[]) => prev.map((msg: Message) => 
          msg.messageId === messageId 
            ? { ...msg, wasHelpful: helpful }
            : msg
        ));
      }
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call chatbot API with session ID
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentMessage,
          sessionId: sessionId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if the intent from API is a navigation intent
        if (NAVIGATION_INTENTS.includes(data.intent)) {
          // Add bot message first, then navigate after a short delay
          addBotMessage(data.response, data);
          
          // Navigate after showing the message
          setTimeout(() => {
            const route = PAGE_ROUTES[data.intent as keyof typeof PAGE_ROUTES];
            if (route) {
              router.push(route);
            }
          }, 2000);
        } else {
          addBotMessage(data.response, data);
        }
      } else {
        // Fallback to local responses if API fails
        const intent = detectIntent(currentMessage);
        const responses = CHATBOT_RESPONSES[intent];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addBotMessage(randomResponse);
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      // Fallback to local responses
      const intent = detectIntent(currentMessage);
      const responses = CHATBOT_RESPONSES[intent];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addBotMessage(randomResponse);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    
    // Add welcome message if no messages exist
    if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage(CHATBOT_RESPONSES.greeting[0]);
      }, 500);
    }
  };

  // Resize functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = chatbotSize.width;
    const startHeight = chatbotSize.height;

    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calculate new dimensions based on direction
      if (direction.includes('left')) {
        newWidth = Math.max(280, startWidth - (e.clientX - startX));
      }
      if (direction.includes('right')) {
        newWidth = Math.max(280, startWidth + (e.clientX - startX));
      }
      if (direction.includes('top')) {
        newHeight = Math.max(200, startHeight - (e.clientY - startY));
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(200, startHeight + (e.clientY - startY));
      }

      // Limit maximum size
      newWidth = Math.min(600, newWidth);
      newHeight = Math.min(800, newHeight);

      setChatbotSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Prevent text selection while resizing
  useEffect(() => {
    if (isResizing) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'nw-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
    
    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={openChat}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        ref={chatbotRef}
        className="relative"
        style={{
          width: chatbotSize.width,
          height: isMinimized ? 56 : chatbotSize.height
        }}
      >
        <Card className="shadow-xl transition-all duration-300 flex flex-col h-full relative">
          {/* Resize handles */}
          {!isMinimized && (
            <>
              {/* Top resize handle */}
              <div
                className="absolute top-0 left-0 right-0 h-1 cursor-n-resize hover:bg-primary/30 z-10"
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'top')}
              />
              
              {/* Left resize handle */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize hover:bg-primary/30 z-10"
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'left')}
              />
              
              {/* Right resize handle */}
              <div
                className="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize hover:bg-primary/30 z-10"
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'right')}
              />
              
              {/* Bottom resize handle */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize hover:bg-primary/30 z-10"
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'bottom')}
              />
              
              {/* Corner resize handles */}
              <div
                className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize hover:bg-primary/50 z-20"
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'top-left')}
              />
              <div
                className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize hover:bg-primary/50 z-20"
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'top-right')}
              />
              <div
                className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize hover:bg-primary/50 z-20"
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'bottom-left')}
              />
              <div
                className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize hover:bg-primary/50 z-20"
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'bottom-right')}
              />
            </>
          )}

          <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg flex-shrink-0 relative z-30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Portfolio Assistant
                {isResizing && (
                  <span className="ml-2 text-xs opacity-70">
                    {chatbotSize.width}×{chatbotSize.height}
                  </span>
                )}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="flex flex-col flex-1 p-0 min-h-0 relative z-30">
              {/* Messages Container - Takes remaining space */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.map((message: Message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg text-sm break-words",
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground p-3'
                          : 'bg-muted'
                      )}
                    >
                      {message.sender === 'bot' ? (
                        <div className="space-y-2">
                          <div className="p-3 whitespace-pre-wrap">{message.text}</div>
                          
                          {/* Learning feedback buttons for bot messages */}
                          {message.conversationId && message.messageId && message.wasHelpful === undefined && (
                            <div className="px-3 pb-2 flex items-center gap-2 text-xs border-t border-muted-foreground/20 pt-2">
                              <span className="text-muted-foreground">Was this helpful?</span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(message.messageId!, message.conversationId!, true)}
                                  className="h-6 px-2 text-xs hover:bg-green-100 hover:text-green-700"
                                >
                                  👍 Yes
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(message.messageId!, message.conversationId!, false)}
                                  className="h-6 px-2 text-xs hover:bg-red-100 hover:text-red-700"
                                >
                                  👎 No
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Show feedback status */}
                          {message.wasHelpful !== undefined && (
                            <div className="px-3 pb-2 text-xs text-muted-foreground border-t border-muted-foreground/20 pt-2">
                              {message.wasHelpful ? (
                                <span className="text-green-600">✅ Thanks for the feedback! I'll learn from this.</span>
                              ) : (
                                <span className="text-orange-600">📝 Thanks! I'll improve my response for next time.</span>
                              )}
                            </div>
                          )}
                          
                          {/* Show confidence and source info for development */}
                          {(message.confidence || message.source) && typeof window !== 'undefined' && (
                            <div className="px-3 pb-2 text-xs text-muted-foreground border-t border-muted-foreground/20 pt-2">
                              {message.confidence && (
                                <span className="mr-3">Confidence: {(message.confidence * 100).toFixed(0)}%</span>
                              )}
                              {message.source && (
                                <span className={cn(
                                  "px-1 py-0.5 rounded text-xs",
                                  message.source === 'learned' && "bg-green-100 text-green-700",
                                  message.source === 'generated' && "bg-blue-100 text-blue-700",
                                  message.source === 'default' && "bg-gray-100 text-gray-700"
                                )}>
                                  {message.source}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.text}</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Fixed at bottom */}
              <div className="border-t bg-background p-3 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Hỏi về portfolio..."
                    className="flex-1 h-9"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="sm"
                    disabled={isTyping || !inputMessage.trim()}
                    className="h-9 px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}