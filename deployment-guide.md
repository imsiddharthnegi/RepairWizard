# RepairWizard Deployment Guide

## Essential Files & Folders for GitHub Upload

### Core Application Files
```
/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # UI components (entire folder)
│   │   ├── hooks/            # React hooks
│   │   ├── lib/              # Utility libraries
│   │   ├── pages/            # Application pages
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/                   # Backend Express application
│   ├── index.ts             # Main server entry point
│   ├── routes.ts            # API routes and iFixit integration
│   ├── storage.ts           # In-memory caching system
│   └── vite.ts              # Vite development setup
├── shared/                  # Shared TypeScript schemas
│   └── schema.ts            # Database and API schemas
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── components.json          # shadcn/ui configuration
├── drizzle.config.ts        # Database configuration
├── README.md                # Project documentation
└── .gitignore               # Git ignore rules
```

### Documentation Files
- `replit.md` - Project architecture and changelog
- `deployment-guide.md` - This deployment guide

### Configuration Files (REQUIRED)
- `.gitignore` - Already configured for Node.js
- `.env.example` - Environment variables template

## GitHub Repository Setup

### 1. Create .env.example file
```bash
# Database Configuration (Optional - uses in-memory fallback)
DATABASE_URL=postgresql://username:password@localhost:5432/repairwizard

# Server Configuration
NODE_ENV=production
PORT=5000
```

### 2. Update README.md
Create a comprehensive README with:
- Project description
- API endpoints documentation
- Setup instructions
- Deployment guide

### 3. Git Commands
```bash
git init
git add .
git commit -m "Initial commit: RepairWizard API"
git branch -M main
git remote add origin https://github.com/yourusername/repairwizard.git
git push -u origin main
```

## Render Deployment Configuration

### 1. Build Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 20.x

### 2. Environment Variables (Optional)
- `NODE_ENV=production`
- `DATABASE_URL` (if using PostgreSQL)

### 3. Required Scripts in package.json
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && tsc server/index.ts --outDir dist --target es2020 --module commonjs --esModuleInterop --allowSyntheticDefaultImports --skipLibCheck",
    "start": "NODE_ENV=production node dist/index.js",
    "preview": "vite preview"
  }
}
```

## Deployment Steps

### For Render:
1. Connect your GitHub repository
2. Select "Web Service"
3. Configure build settings:
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables if needed
5. Deploy

### Database Options:
- **Development**: Uses in-memory storage (no setup required)
- **Production**: Add PostgreSQL database URL to environment variables

## Production Optimizations

### Performance
- Gzip compression enabled
- Static file caching
- API response caching (24-hour TTL)

### Security
- CORS configured
- Environment variable protection
- Input validation with Zod

### Monitoring
- Health check endpoint: `/api/health`
- Error logging and handling
- Request/response logging

## API Endpoints (Live Demo)
- `GET /api/search/:query` - Hierarchical device search
- `GET /api/brands` - List all device brands
- `GET /api/health` - Server health check
- `GET /api/guide/:device` - Detailed repair guides
- `GET /api/stats` - API usage statistics

## Features Showcase
- Real iFixit API integration
- 100+ device models across 13 brands
- Intelligent search hierarchy (brand → device → repair)
- Professional UI with shadcn/ui components
- TypeScript throughout (frontend + backend)
- In-memory caching with fallback data