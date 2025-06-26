import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ApiResponseSchema, ErrorResponseSchema } from "@shared/schema";
import { z } from "zod";

// iFixit API configuration
const IFIXIT_BASE_URL = "https://www.ifixit.com/api/2.0";

// Comprehensive device mapping like iFixit
const BRAND_MAPPING: Record<string, string[]> = {
  'apple': ['iphone', 'ipad', 'macbook', 'imac', 'airpods', 'apple-watch', 'apple-tv'],
  'samsung': ['galaxy-s', 'galaxy-note', 'galaxy-a', 'galaxy-tab', 'galaxy-watch', 'galaxy-buds'],
  'google': ['pixel', 'pixelbook', 'nest', 'chromecast'],
  'microsoft': ['surface', 'xbox', 'hololens'],
  'sony': ['playstation', 'xperia', 'camera', 'headphones'],
  'nintendo': ['switch', 'ds', '3ds'],
  'lg': ['tv', 'monitor', 'smartphone'],
  'oneplus': ['oneplus-phone'],
  'huawei': ['smartphone', 'tablet', 'watch'],
  'xiaomi': ['smartphone', 'tablet', 'earbuds'],
  'hp': ['laptop', 'desktop', 'printer'],
  'dell': ['laptop', 'desktop', 'monitor'],
  'lenovo': ['thinkpad', 'ideapad', 'tablet'],
};

const DEVICE_MAPPING: Record<string, string[]> = {
  'iphone': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini', 'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini', 'iPhone SE 3rd Gen', 'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11', 'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X'],
  'ipad': ['iPad Pro 12.9" 6th Gen', 'iPad Pro 11" 4th Gen', 'iPad Air 5th Gen', 'iPad 10th Gen', 'iPad mini 6th Gen', 'iPad Pro 12.9" 5th Gen', 'iPad Pro 11" 3rd Gen', 'iPad Air 4th Gen', 'iPad 9th Gen'],
  'macbook': ['MacBook Air M2', 'MacBook Air M1', 'MacBook Pro 16" M2', 'MacBook Pro 14" M2', 'MacBook Pro 13" M2', 'MacBook Pro 16" M1', 'MacBook Pro 14" M1', 'MacBook Pro 13" M1'],
  'imac': ['iMac 24" M1', 'iMac 27" Intel', 'iMac Pro'],
  'airpods': ['AirPods Pro 2nd Gen', 'AirPods 3rd Gen', 'AirPods Pro 1st Gen', 'AirPods 2nd Gen', 'AirPods Max'],
  'apple-watch': ['Apple Watch Series 9', 'Apple Watch Ultra 2', 'Apple Watch SE 2nd Gen', 'Apple Watch Series 8', 'Apple Watch Ultra'],
  'galaxy-s': ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22', 'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21'],
  'galaxy-note': ['Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10+', 'Galaxy Note 10', 'Galaxy Note 9'],
  'galaxy-a': ['Galaxy A54', 'Galaxy A34', 'Galaxy A24', 'Galaxy A14', 'Galaxy A53', 'Galaxy A33', 'Galaxy A23'],
  'galaxy-tab': ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9', 'Galaxy Tab S8 Ultra', 'Galaxy Tab S8+', 'Galaxy Tab S8'],
  'pixel': ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6a', 'Pixel 6 Pro', 'Pixel 6', 'Pixel 5a', 'Pixel 5'],
  'surface': ['Surface Laptop 5', 'Surface Pro 9', 'Surface Studio 2+', 'Surface Book 3', 'Surface Go 3'],
  'xbox': ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One S'],
  'playstation': ['PlayStation 5', 'PlayStation 4 Pro', 'PlayStation 4 Slim', 'PlayStation VR2'],
  'switch': ['Nintendo Switch OLED', 'Nintendo Switch Lite', 'Nintendo Switch'],
  'oneplus-phone': ['OnePlus 11', 'OnePlus 10 Pro', 'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus 8T', 'OnePlus 8 Pro'],
};

async function fetchFromIFixit(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${IFIXIT_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`iFixit API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('iFixit API call failed:', error);
    return null;
  }
}

async function getDevicesFromIFixit(brand: string): Promise<string[]> {
  // For brand level searches, return our predefined device categories
  // This gives us consistent results for the dropdown navigation
  if (BRAND_MAPPING[brand.toLowerCase()]) {
    return BRAND_MAPPING[brand.toLowerCase()];
  }
  
  // If it's a device category (like "iphone"), get specific models
  if (DEVICE_MAPPING[brand.toLowerCase()]) {
    return DEVICE_MAPPING[brand.toLowerCase()];
  }
  
  // Try to get categories from iFixit API as fallback
  const categories = await fetchFromIFixit(`/categories`);
  
  if (categories && categories.length > 0) {
    // Filter categories by brand name
    const brandCategories = categories.filter((cat: any) => 
      cat.title && cat.title.toLowerCase().includes(brand.toLowerCase())
    );
    
    if (brandCategories.length > 0) {
      return brandCategories.slice(0, 10).map((cat: any) => cat.title);
    }
  }
  
  return [];
}

async function getRepairGuides(deviceModel: string): Promise<string[]> {
  // First try to get guides from iFixit API
  const guides = await fetchFromIFixit(`/guides?filter=all&query=${encodeURIComponent(deviceModel)}`);
  
  if (guides && guides.guides && guides.guides.length > 0) {
    return guides.guides.slice(0, 10).map((guide: any) => guide.title);
  }

  // Fallback to common repair types if API doesn't return results
  const commonRepairs = [
    'Battery Replacement',
    'Screen Replacement', 
    'Camera Repair',
    'Speaker Repair',
    'Charging Port Repair',
    'Button Repair',
    'Back Cover Replacement',
    'Logic Board Repair'
  ];

  return commonRepairs.map(repair => `${repair} for ${deviceModel}`);
}

function determineSearchLevel(query: string): number {
  if (BRAND_MAPPING[query.toLowerCase()]) return 1; // Brand level
  if (DEVICE_MAPPING[query.toLowerCase()]) return 2; // Device category level
  return 3; // Specific device/repair level
}

async function performSearch(query: string): Promise<string[]> {
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hyphenatedQuery = query.toLowerCase().replace(/\s+/g, '-');
  
  // Level 1: Brand search - get devices from iFixit API
  if (BRAND_MAPPING[normalizedQuery]) {
    const devices = await getDevicesFromIFixit(normalizedQuery);
    return devices.length > 0 ? devices : BRAND_MAPPING[normalizedQuery];
  }
  
  // Level 2: Device category search
  if (DEVICE_MAPPING[normalizedQuery]) {
    return DEVICE_MAPPING[normalizedQuery];
  }
  
  // Level 3: Specific device model - get repair guides
  // For iPhone models, normalize the query to match our patterns
  if (normalizedQuery.startsWith('iphone') && normalizedQuery.length > 6) {
    const modelNumber = normalizedQuery.replace('iphone', '');
    const formattedModel = `iPhone ${modelNumber}`;
    const repairGuides = await getRepairGuides(formattedModel);
    if (repairGuides.length > 0) {
      return repairGuides;
    }
  }
  
  const repairGuides = await getRepairGuides(query);
  if (repairGuides.length > 0) {
    return repairGuides;
  }
  
  // If no direct matches, try iFixit search with both original and hyphenated versions
  let searchResults = await fetchFromIFixit(`/search/${encodeURIComponent(query)}`);
  if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
    searchResults = await fetchFromIFixit(`/search/${encodeURIComponent(hyphenatedQuery)}`);
  }
  
  if (searchResults && searchResults.results && searchResults.results.length > 0) {
    return searchResults.results.slice(0, 10).map((result: any) => result.title || result.name);
  }
  
  return [];
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "online", 
      timestamp: new Date().toISOString(),
      service: "RepairAPI Demo"
    });
  });

  // Main search endpoint
  app.get("/api/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      
      if (!query || query.trim() === '') {
        const errorResponse = ErrorResponseSchema.parse({
          success: false,
          error: "MISSING_QUERY",
          message: "Search query is required",
          timestamp: new Date().toISOString(),
        });
        return res.status(400).json(errorResponse);
      }

      const normalizedQuery = query.toLowerCase().trim();
      
      // Check cache first
      const cached = await storage.getCachedSearch(normalizedQuery);
      if (cached) {
        const response = ApiResponseSchema.parse({
          success: true,
          query: normalizedQuery,
          results: cached.results as string[],
          count: (cached.results as string[]).length,
          timestamp: new Date().toISOString(),
          level: cached.level,
          cached: true,
        });
        return res.json(response);
      }

      // Perform search
      const results = await performSearch(normalizedQuery);
      const level = determineSearchLevel(normalizedQuery);

      if (results.length === 0) {
        const errorResponse = ErrorResponseSchema.parse({
          success: false,
          error: "NO_RESULTS",
          message: `No results found for "${query}". Try searching for brands like 'apple', 'samsung', device categories like 'iphone', 'galaxy', or specific models like 'iphone-11'`,
          timestamp: new Date().toISOString(),
        });
        return res.status(404).json(errorResponse);
      }

      // Cache the results
      await storage.cacheSearchResult({
        query: normalizedQuery,
        results: results,
        level: level,
      });

      const response = ApiResponseSchema.parse({
        success: true,
        query: normalizedQuery,
        results: results,
        count: results.length,
        timestamp: new Date().toISOString(),
        level: level,
      });

      res.json(response);

    } catch (error) {
      console.error('Search endpoint error:', error);
      
      const errorResponse = ErrorResponseSchema.parse({
        success: false,
        error: "INTERNAL_ERROR",
        message: "An internal server error occurred",
        timestamp: new Date().toISOString(),
      });
      
      res.status(500).json(errorResponse);
    }
  });

  // Get available brands endpoint
  app.get("/api/brands", (req, res) => {
    const brands = Object.keys(BRAND_MAPPING);
    const response = ApiResponseSchema.parse({
      success: true,
      query: "brands",
      results: brands,
      count: brands.length,
      timestamp: new Date().toISOString(),
      level: 0,
    });
    res.json(response);
  });

  // Get repair guide details endpoint
  app.get("/api/guide/:deviceModel", async (req, res) => {
    try {
      const { deviceModel } = req.params;
      
      if (!deviceModel || deviceModel.trim() === '') {
        const errorResponse = ErrorResponseSchema.parse({
          success: false,
          error: "MISSING_DEVICE",
          message: "Device model is required",
          timestamp: new Date().toISOString(),
        });
        return res.status(400).json(errorResponse);
      }

      // Get specific guides from iFixit API
      const guides = await fetchFromIFixit(`/guides?filter=all&query=${encodeURIComponent(deviceModel)}&limit=10`);
      
      let results = [];
      if (guides && guides.guides && guides.guides.length > 0) {
        results = guides.guides.map((guide: any) => ({
          id: guide.guideid,
          title: guide.title,
          difficulty: guide.difficulty || 'Moderate',
          timeRequired: guide.time_required || '30-60 minutes',
          tools: guide.tools || [],
          url: `https://www.ifixit.com/Guide/${guide.title.replace(/\s+/g, '-')}/${guide.guideid}`
        }));
      } else {
        // Fallback with common repairs
        const commonRepairs = [
          'Battery Replacement',
          'Screen Replacement', 
          'Camera Repair',
          'Speaker Repair',
          'Charging Port Repair'
        ];
        results = commonRepairs.map((repair, index) => ({
          id: index + 1,
          title: `${repair} for ${deviceModel}`,
          difficulty: 'Moderate',
          timeRequired: '30-60 minutes',
          tools: ['Phillips #00 Screwdriver', 'Spudger', 'Suction Handle'],
          url: '#'
        }));
      }

      const response = {
        success: true,
        query: deviceModel,
        results: results,
        count: results.length,
        timestamp: new Date().toISOString(),
        level: 3,
      };

      res.json(response);

    } catch (error) {
      console.error('Guide endpoint error:', error);
      
      const errorResponse = ErrorResponseSchema.parse({
        success: false,
        error: "INTERNAL_ERROR",
        message: "An internal server error occurred",
        timestamp: new Date().toISOString(),
      });
      
      res.status(500).json(errorResponse);
    }
  });

  // Statistics endpoint
  app.get("/api/stats", async (req, res) => {
    const stats = {
      success: true,
      data: {
        totalBrands: Object.keys(BRAND_MAPPING).length,
        totalDeviceCategories: Object.values(BRAND_MAPPING).flat().length,
        totalDeviceModels: Object.values(DEVICE_MAPPING).flat().length,
        cacheHits: 0, // Could track this with storage
        uptime: process.uptime(),
        version: "1.0.0"
      },
      timestamp: new Date().toISOString(),
    };
    res.json(stats);
  });

  const httpServer = createServer(app);
  return httpServer;
}
