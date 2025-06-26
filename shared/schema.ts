import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const searchResults = pgTable("search_results", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  results: jsonb("results").notNull(),
  level: integer("level").notNull(), // 1 = brands, 2 = devices, 3 = repairs
  cached_at: text("cached_at").notNull(),
});

export const insertSearchResultSchema = createInsertSchema(searchResults).omit({
  id: true,
  cached_at: true,
});

export type InsertSearchResult = z.infer<typeof insertSearchResultSchema>;
export type SearchResult = typeof searchResults.$inferSelect;

// Response types for API
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  query: z.string(),
  results: z.array(z.string()),
  count: z.number(),
  timestamp: z.string(),
  level: z.number().optional(),
  cached: z.boolean().optional(),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;

export const ErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.string(),
  message: z.string().optional(),
  timestamp: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
