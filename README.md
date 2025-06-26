# RepairWizard 🔧

**Intelligent Device Repair Search API** - A comprehensive Node.js backend that integrates with iFixit's API to provide hierarchical device repair search functionality.

## 🚀 Live Demo

[View Live Application](https://your-app.onrender.com)

## ✨ Features

- **3-Level Hierarchical Search**: Brand → Device → Repair Guides
- **Real iFixit Integration**: Live data from iFixit's repair database
- **100+ Device Models**: Support for 13 major brands (Apple, Samsung, Google, Microsoft, Sony, Nintendo, OnePlus, Xiaomi, HP, Dell, Lenovo, LG, Huawei)
- **Intelligent Caching**: 24-hour response caching for optimal performance
- **Professional UI**: Built with React, TypeScript, and shadcn/ui components
- **Fallback Data**: Comprehensive offline data when API is unavailable

## 🏗️ Architecture

### Backend (Node.js + Express)
- **TypeScript**: Full type safety throughout the application
- **Express.js**: RESTful API endpoints with proper error handling
- **Zod Validation**: Schema validation for all API requests/responses
- **In-Memory Caching**: Fast response times with automatic cache expiration

### Frontend (React + TypeScript)
- **React 18**: Modern hooks and component patterns
- **TanStack Query**: Efficient server state management
- **shadcn/ui**: Professional, accessible UI components
- **Tailwind CSS**: Utility-first styling with custom design system

## 📡 API Endpoints

### Core Endpoints
```bash
GET /api/search/:query     # Hierarchical device search
GET /api/brands           # List all available brands  
GET /api/health          # Server health check
```

### Enhanced Features
```bash
GET /api/guide/:device   # Detailed repair guides with tools
GET /api/stats          # API usage statistics
```

### Example API Calls
```bash
# Level 1: Brand Search
curl https://your-app.onrender.com/api/search/apple
# Returns: ["iphone", "ipad", "macbook", "imac", "airpods", "apple-watch"]

# Level 2: Device Search  
curl https://your-app.onrender.com/api/search/iphone
# Returns: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", ...]

# Level 3: Repair Search
curl https://your-app.onrender.com/api/search/iphone-15-pro
# Returns: ["Battery Replacement", "Screen Replacement", ...]
```

## 🛠️ Technology Stack

**Backend:**
- Node.js 20+
- Express.js
- TypeScript
- Zod (validation)
- iFixit API integration

**Frontend:**
- React 18
- TypeScript
- TanStack Query
- shadcn/ui + Radix UI
- Tailwind CSS
- Vite (build tool)

**Development:**
- ESM modules
- Hot reload
- Type checking
- Code splitting

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/repairwizard.git
cd repairwizard

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Build for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Render Deployment
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 20.x

### Environment Variables (Optional)
```bash
NODE_ENV=production
DATABASE_URL=postgresql://... # Optional: for persistent caching
```

### Vercel/Netlify Alternative
The application can also be deployed on Vercel or Netlify with minimal configuration changes.

## 📊 Performance Features

- **Response Caching**: 24-hour TTL for API responses
- **Gzip Compression**: Automatic response compression
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **Request Validation**: Input sanitization and validation
- **Fallback Data**: 100% uptime with offline device database

## 🔧 Development

### Project Structure
```
src/
├── client/           # React frontend
│   ├── components/   # Reusable UI components
│   ├── pages/       # Application pages
│   └── lib/         # Utilities and API client
├── server/          # Express backend
│   ├── routes.ts    # API route handlers
│   ├── storage.ts   # Caching implementation
│   └── index.ts     # Server entry point
└── shared/          # Shared TypeScript types
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run preview  # Preview production build
```

## 📄 API Response Format

All API responses follow a consistent schema:

```typescript
{
  success: boolean;
  query: string;
  results: string[];
  count: number;
  timestamp: string;
  level?: number;      // 1=brands, 2=devices, 3=repairs
  cached?: boolean;    // true if served from cache
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [iFixit](https://www.ifixit.com/) for providing the repair guide API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives

---

**Built for technical recruitment demonstration** | **Full-stack TypeScript application showcasing modern web development practices**