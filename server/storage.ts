import { searchResults, type SearchResult, type InsertSearchResult } from "@shared/schema";

export interface IStorage {
  getCachedSearch(query: string): Promise<SearchResult | undefined>;
  cacheSearchResult(result: InsertSearchResult): Promise<SearchResult>;
  clearExpiredCache(): Promise<void>;
}

export class MemStorage implements IStorage {
  private cache: Map<string, SearchResult>;
  private currentId: number;

  constructor() {
    this.cache = new Map();
    this.currentId = 1;
    
    // Clear expired cache every hour
    setInterval(() => {
      this.clearExpiredCache();
    }, 60 * 60 * 1000);
  }

  async getCachedSearch(query: string): Promise<SearchResult | undefined> {
    const cached = this.cache.get(query.toLowerCase());
    if (!cached) return undefined;

    // Check if cache is still valid (24 hours)
    const cacheTime = new Date(cached.cached_at).getTime();
    const now = new Date().getTime();
    const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      this.cache.delete(query.toLowerCase());
      return undefined;
    }

    return cached;
  }

  async cacheSearchResult(insertResult: InsertSearchResult): Promise<SearchResult> {
    const id = this.currentId++;
    const result: SearchResult = {
      ...insertResult,
      id,
      cached_at: new Date().toISOString(),
    };
    
    this.cache.set(insertResult.query.toLowerCase(), result);
    return result;
  }

  async clearExpiredCache(): Promise<void> {
    const now = new Date().getTime();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((result, key) => {
      const cacheTime = new Date(result.cached_at).getTime();
      const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

export const storage = new MemStorage();
