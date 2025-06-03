'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, TrendingUp, Database, Users, BarChart3 } from 'lucide-react';

interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  averageSatisfaction: number;
  helpfulMessagesCount: number;
}

interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  intent: string;
  confidence: number;
  usageCount: number;
  successRate: number;
  source: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LearningPattern {
  id: string;
  pattern: string;
  patternType: string;
  intent: string;
  confidence: number;
  examples: string[];
  successCount: number;
  totalAttempts: number;
  lastUsed: string | null;
  isActive: boolean;
}

export default function ChatbotAdminPage() {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);
  const [patterns, setPatterns] = useState<LearningPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch conversation stats
      const statsResponse = await fetch('/api/admin/chatbot/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch learned knowledge
      const knowledgeResponse = await fetch('/api/admin/chatbot/knowledge');
      if (knowledgeResponse.ok) {
        const knowledgeData = await knowledgeResponse.json();
        setKnowledge(knowledgeData);
      }

      // Fetch learning patterns
      const patternsResponse = await fetch('/api/admin/chatbot/patterns');
      if (patternsResponse.ok) {
        const patternsData = await patternsResponse.json();
        setPatterns(patternsData);
      }
    } catch (error) {
      console.error('Error fetching chatbot admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleKnowledgeStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/chatbot/knowledge/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        setKnowledge(prev => prev.map(item => 
          item.id === id ? { ...item, isActive: !isActive } : item
        ));
      }
    } catch (error) {
      console.error('Error updating knowledge status:', error);
    }
  };

  const deleteKnowledgeEntry = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa knowledge entry này?')) return;

    try {
      const response = await fetch(`/api/admin/chatbot/knowledge/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setKnowledge(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting knowledge entry:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Chatbot Learning System</h1>
          <p className="text-muted-foreground">Quản lý hệ thống tự học của chatbot</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConversations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Helpful Messages</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.helpfulMessagesCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalMessages > 0 ? 
                  `${((stats.helpfulMessagesCount / stats.totalMessages) * 100).toFixed(1)}% helpful rate` 
                  : 'No data'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageSatisfaction ? stats.averageSatisfaction.toFixed(1) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="knowledge" className="space-y-6">
        <TabsList>
          <TabsTrigger value="knowledge">Learned Knowledge</TabsTrigger>
          <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
          <TabsTrigger value="conversations">Recent Conversations</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Learned Knowledge Base ({knowledge.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {knowledge.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Chưa có knowledge entries nào được học.
                </p>
              ) : (
                <div className="space-y-4">
                  {knowledge.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={entry.isActive ? "default" : "secondary"}>
                              {entry.intent}
                            </Badge>
                            <Badge variant="outline">
                              {entry.source}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Confidence: {(entry.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          
                          <div>
                            <p className="font-medium text-sm">Question Pattern:</p>
                            <p className="text-sm">{entry.question}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium text-sm">Learned Response:</p>
                            <p className="text-sm">{entry.answer.substring(0, 200)}
                              {entry.answer.length > 200 && '...'}
                            </p>
                          </div>
                          
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Used: {entry.usageCount} times</span>
                            <span>Success Rate: {(entry.successRate * 100).toFixed(1)}%</span>
                            <span>Created: {new Date(entry.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            variant={entry.isActive ? "destructive" : "default"}
                            onClick={() => toggleKnowledgeStatus(entry.id, entry.isActive)}
                          >
                            {entry.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteKnowledgeEntry(entry.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Learning Patterns ({patterns.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patterns.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Chưa có learning patterns nào.
                </p>
              ) : (
                <div className="space-y-4">
                  {patterns.map((pattern) => (
                    <div key={pattern.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={pattern.isActive ? "default" : "secondary"}>
                              {pattern.intent}
                            </Badge>
                            <Badge variant="outline">
                              {pattern.patternType}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Confidence: {(pattern.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          
                          <div>
                            <p className="font-medium text-sm">Pattern:</p>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {pattern.pattern}
                            </code>
                          </div>
                            <div>
                            <p className="font-medium text-sm">Examples:</p>
                            <div className="space-y-1">
                              {pattern.examples.slice(0, 3).map((example, index) => (
                                <p key={index} className="text-sm text-muted-foreground">
                                  "{example}"
                                </p>
                              ))}
                              {pattern.examples.length > 3 && (
                                <p className="text-sm text-muted-foreground">
                                  +{pattern.examples.length - 3} more examples
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Success: {pattern.successCount}/{pattern.totalAttempts}</span>
                            <span>
                              Success Rate: {pattern.totalAttempts > 0 ? 
                                ((pattern.successCount / pattern.totalAttempts) * 100).toFixed(1) : 0}%
                            </span>
                            <span>
                              Last Used: {pattern.lastUsed ? 
                                new Date(pattern.lastUsed).toLocaleDateString() : 'Never'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Conversation history sẽ được hiển thị ở đây.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}