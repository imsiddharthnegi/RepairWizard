# Device Repair Search API

## Overview

This application is a full-stack TypeScript web application that provides a hierarchical search interface for device repair information. Built with React frontend and Express backend, it features a three-level search system: brands → devices → repair guides. The application integrates with the iFixit API to provide real repair data and implements intelligent caching for improved performance.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints with hierarchical search levels
- **External Integration**: iFixit API for repair guide data
- **Error Handling**: Centralized error middleware with structured responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured via Drizzle ORM)
- **Fallback Storage**: In-memory caching system for development
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Connection**: Neon Database serverless adapter for production

## Key Components

### Database Schema
```typescript
// Search results caching table
searchResults: {
  id: serial (primary key)
  query: text (search term)
  results: jsonb (cached results array)
  level: integer (1=brands, 2=devices, 3=repairs)
  cached_at: text (ISO timestamp)
}
```

### API Endpoints
- `GET /api/health` - Health check endpoint
- `GET /api/search/:query` - Hierarchical search for brands, devices, and repair guides
- `GET /api/brands` - Get all available device brands
- `GET /api/guide/:device` - Detailed repair guide information with tools and difficulty
- `GET /api/stats` - API usage statistics and system information

### Frontend Components
- **Home Page**: Main search interface with real-time API demonstration
- **Search Interface**: Multi-level search with visual feedback
- **Response Display**: Formatted JSON responses with copy functionality
- **UI Components**: Complete shadcn/ui component library

## Data Flow

1. **User Search**: User enters search term and selects level
2. **Cache Check**: Backend checks for cached results (24-hour TTL)
3. **API Integration**: If not cached, fetch from iFixit API
4. **Fallback Data**: Use predefined hierarchical mappings if API unavailable
5. **Cache Storage**: Store results in database/memory for future requests
6. **Response**: Return structured JSON with metadata

### Search Level Hierarchy
- **Level 1 (Brands)**: Apple, Samsung, Google, Microsoft, Sony, Nintendo
- **Level 2 (Devices)**: Device models per brand (iPhone, Galaxy, Pixel, etc.)
- **Level 3 (Repairs)**: Specific repair guides for selected device models

## External Dependencies

### Backend Dependencies
- `express` - Web framework
- `drizzle-orm` - Type-safe ORM
- `@neondatabase/serverless` - Database adapter
- `zod` - Schema validation
- `tsx` - TypeScript execution

### Frontend Dependencies
- `react` & `react-dom` - UI framework
- `@tanstack/react-query` - Server state management
- `wouter` - Lightweight routing
- `@radix-ui/*` - Accessible UI primitives
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library

### Development Tools
- `vite` - Build tool and dev server
- `typescript` - Type checking
- `drizzle-kit` - Database migrations
- `esbuild` - Production bundling

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Server**: Express with Vite middleware
- **Port**: 5000 (configured in .replit)
- **Hot Reload**: Enabled for both frontend and backend

### Production Build
- **Frontend**: `vite build` → `dist/public`
- **Backend**: `esbuild` → `dist/index.js`
- **Start Command**: `npm start`
- **Deployment Target**: Replit Autoscale

### Database Setup
- **Development**: Memory storage fallback
- **Production**: PostgreSQL via DATABASE_URL environment variable
- **Migrations**: `npm run db:push` to sync schema

### Environment Configuration
- Database provisioning required for production
- Replit modules: nodejs-20, web, postgresql-16
- Build process handles both frontend and backend compilation

## Changelog

Changelog:
- June 25, 2025. Initial setup with hierarchical search API
- June 25, 2025. Fixed search handling for device models with spaces (e.g., "iPhone 13")
- June 25, 2025. Improved query normalization to handle various input formats
- June 25, 2025. Added dropdown navigation interface (Browse/Search modes)
- June 25, 2025. Enhanced with 4 additional API endpoints (brands, guide details, stats)
- June 25, 2025. Implemented professional repair guide display with difficulty badges
- June 25, 2025. Added comprehensive API documentation and endpoint reference
- June 25, 2025. Removed browse mode completely, focused on search-only interface like iFixit
- June 25, 2025. Expanded device database to 100+ models across 13 brands (Apple, Samsung, Google, Microsoft, Sony, Nintendo, LG, OnePlus, Huawei, Xiaomi, HP, Dell, Lenovo)
- June 25, 2025. Added popular device searches and brand quick-access buttons
- June 25, 2025. Repositioned search interface to top priority, moved API demo to bottom
- June 25, 2025. Enhanced logo to "RepairWizard" with gradient styling and improved visual appeal

## User Preferences

Preferred communication style: Simple, everyday language.