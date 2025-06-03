// Chatbot Performance Cache System
// Enhanced caching for improved response times

interface CacheEntry {
  response: any;
  timestamp: number;
  intent: string;
  confidence: number;
}

interface QueryVector {
  query: string;
  intent: string;
  keywords: string[];
  hash: string;
}

class ChatbotCache {
  private static cache = new Map<string, CacheEntry>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_CACHE_SIZE = 1000;
  private static readonly SIMILARITY_THRESHOLD = 0.8;

  // Generate cache key from query
  private static generateCacheKey(query: string, intent: string): string {
    return `${intent}:${query.toLowerCase().trim()}`;
  }

  // Generate query hash for similarity matching
  private static generateQueryHash(query: string): string {
    const normalized = query.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 2) // Filter short words
      .sort() // Sort for consistency
      .join('_');
    
    return normalized;
  }

  // Calculate similarity between two queries
  private static calculateSimilarity(query1: string, query2: string): number {
    const words1 = new Set(query1.toLowerCase().split(/\s+/));
    const words2 = new Set(query2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  // Get cached response
  static getCachedResponse(query: string, intent: string): any | null {
    // Clean expired entries first
    this.cleanExpiredEntries();

    const cacheKey = this.generateCacheKey(query, intent);
    const cached = this.cache.get(cacheKey);

    if (cached && !this.isExpired(cached)) {
      console.log(`📦 Cache HIT for: ${query} (${intent})`);
      return {
        ...cached.response,
        source: `${cached.response.source}_cached`,
        confidence: cached.confidence,
        cached: true
      };
    }

    // Try similarity matching for partial cache hits
    const similarResponse = this.findSimilarResponse(query, intent);
    if (similarResponse) {
      console.log(`🔍 Similar cache HIT for: ${query}`);
      return {
        ...similarResponse.response,
        source: `${similarResponse.response.source}_similar`,
        confidence: similarResponse.confidence * 0.9, // Slightly lower confidence
        cached: true,
        similar: true
      };
    }

    console.log(`❌ Cache MISS for: ${query} (${intent})`);
    return null;
  }

  // Find similar cached responses
  private static findSimilarResponse(query: string, intent: string): CacheEntry | null {
    const queryWords = query.toLowerCase().split(/\s+/);
    
    for (const [key, entry] of this.cache.entries()) {
      if (!key.startsWith(intent + ':') || this.isExpired(entry)) {
        continue;
      }

      const cachedQuery = key.substring(intent.length + 1);
      const similarity = this.calculateSimilarity(query, cachedQuery);

      if (similarity >= this.SIMILARITY_THRESHOLD) {
        return entry;
      }
    }

    return null;
  }

  // Cache response
  static cacheResponse(query: string, intent: string, response: any, confidence: number = 0.9): void {
    // Ensure cache size limit
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldestEntries();
    }

    const cacheKey = this.generateCacheKey(query, intent);
    const entry: CacheEntry = {
      response,
      timestamp: Date.now(),
      intent,
      confidence
    };

    this.cache.set(cacheKey, entry);
    console.log(`💾 Cached response for: ${query} (${intent})`);
  }

  // Check if entry is expired
  private static isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.CACHE_TTL;
  }

  // Clean expired entries
  private static cleanExpiredEntries(): void {
    let cleaned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
    }
  }

  // Evict oldest entries when cache is full
  private static evictOldestEntries(): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
    const toEvict = Math.floor(this.MAX_CACHE_SIZE * 0.2); // Evict 20%
    
    for (let i = 0; i < toEvict; i++) {
      if (entries[i]) {
        this.cache.delete(entries[i][0]);
      }
    }
    
    console.log(`🗑️ Evicted ${toEvict} oldest cache entries`);
  }

  // Preload common queries (can be called at startup)
  static async preloadCommonQueries(): Promise<void> {
    const commonQueries = [
      { query: "Tell me about your projects", intent: "projects" },
      { query: "What are your skills?", intent: "skills" },
      { query: "Tell me about yourself", intent: "about" },
      { query: "How can I contact you?", intent: "contact" },
      { query: "Do you write blogs?", intent: "blog" },
      { query: "What's your best project?", intent: "projects" },
      { query: "What programming languages do you know?", intent: "skills" },
      { query: "What's your background?", intent: "about" },
      { query: "What's your email?", intent: "contact" },
      { query: "Latest articles?", intent: "blog" }
    ];

    console.log(`🚀 Preloading ${commonQueries.length} common queries...`);
    
    for (const { query, intent } of commonQueries) {
      try {
        // Mock service call for preloading
        const mockResponse = {
          response: `Preloaded response for ${intent} query`,
          intent,
          source: `${intent}_service_preload`,
          confidence: 0.8
        };
        
        this.cacheResponse(query, intent, mockResponse, 0.8);
      } catch (error) {
        console.warn(`Failed to preload query: ${query}`, error);
      }
    }
    
    console.log(`✅ Preloading completed. Cache size: ${this.cache.size}`);
  }

  // Get cache statistics
  static getCacheStats(): {
    size: number;
    maxSize: number;
    ttl: number;
    hitRate?: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      ttl: this.CACHE_TTL,
    };
  }

  // Clear cache (for development/testing)
  static clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  // Warm up cache with intent-specific queries
  static async warmupCache(intent: string): Promise<void> {
    const intentQueries = {
      projects: [
        "Show me your projects",
        "What's your best work?",
        "GitHub repositories",
        "Live demos"
      ],
      skills: [
        "Technical skills",
        "Programming languages",
        "Frontend expertise",
        "Development stack"
      ],
      about: [
        "Professional background",
        "Work experience",
        "Career journey",
        "Personal values"
      ],
      contact: [
        "Contact information",
        "Email address",
        "Professional networks",
        "Collaboration opportunities"
      ],
      blog: [
        "Technical articles",
        "Tutorial content",
        "Latest posts",
        "Learning resources"
      ]
    };

    const queries = intentQueries[intent as keyof typeof intentQueries] || [];
    
    for (const query of queries) {
      const mockResponse = {
        response: `Warmed up response for ${query}`,
        intent,
        source: `${intent}_service_warmup`,
        confidence: 0.7
      };
      
      this.cacheResponse(query, intent, mockResponse, 0.7);
    }
    
    console.log(`🔥 Warmed up cache for ${intent} with ${queries.length} queries`);
  }
}

export default ChatbotCache;
