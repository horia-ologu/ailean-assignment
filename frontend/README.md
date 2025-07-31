# Agent Management Frontend

A Next.js App Router frontend in TypeScript for managing agents and interacting with the Hotel Q&A Bot.

## Features

- ✅ **Next.js 14 App Router** - Modern routing with layouts
- ✅ Fetches agent list from backend API
- ✅ Create new agents with a form
- ✅ Delete existing agents
- ✅ Hardcoded Hotel Q&A Bot for demonstrations
- ✅ Q&A interface for the Hotel Bot
- ✅ Axios for API calls
- ✅ Environment-based backend URL configuration
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety

## Environment Variables

Create a `.env.local` file with:

```bash
# Primary backend URL (used by default)
NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.up.railway.app

# Alternative configurations (optional)
NEXT_PUBLIC_ONLINE_BACKEND_URL=https://your-railway-app.up.railway.app
NEXT_PUBLIC_LOCAL_BACKEND_URL=http://localhost:3001
```

### Environment Variable Priority:

1. `NEXT_PUBLIC_ONLINE_BACKEND_URL` - Online Railway deployment
2. `NEXT_PUBLIC_BACKEND_URL` - Standard backend URL
3. `NEXT_PUBLIC_LOCAL_BACKEND_URL` - Local development
4. `http://localhost:3001` - Default fallback

The frontend will automatically use the highest priority URL available.

### Switching Between Environments:

**For Production (Railway):**

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.up.railway.app
```

**For Local Development:**

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**Mixed Development (Frontend local, Backend on Railway):**

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.up.railway.app
```

## 🚀 Deployment

### Vercel Deployment

#### Option 1: Deploy Frontend Directory Only (Recommended)

1. **Connect Repository**: In Vercel dashboard, when importing the project:

   - Set **Root Directory** to `frontend`
   - Vercel will automatically detect Next.js
   - Environment variables will be configured in Vercel dashboard

2. **Environment Variables in Vercel**:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.up.railway.app
   ```

#### Option 2: Deploy from Monorepo Root

If deploying from the repository root, the `vercel.json` configuration will handle the build process automatically.

#### Troubleshooting Vercel Deployment:

- **Build Error**: Ensure you're deploying from the `frontend` directory or using the root `vercel.json`
- **Environment Variables**: Add them in the Vercel dashboard under Project Settings → Environment Variables
- **Build Command Issues**: Vercel should auto-detect Next.js, no custom build commands needed

## API Integration

The frontend connects to the backend API using the `NEXT_PUBLIC_BACKEND_URL` environment variable. It supports:

- `GET /agents` - Fetch all agents
- `POST /agents` - Create new agents
- `DELETE /agents/:id` - Delete agents
- `POST /agents/:id/ask` - Ask questions to agents

## Hotel Q&A Bot

The application automatically creates and manages a hardcoded "Hotel Q&A Bot" that users can interact with to ask questions about hotel services, amenities, and policies.

## Running the Application

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

The application will run on `http://localhost:3000` by default.

## Project Structure (App Router)

```
frontend/
├── app/
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Main page with agent management
│   ├── loading.tsx       # Loading component
│   └── not-found.tsx     # 404 page
├── services/
│   └── api.ts           # API service with Axios
├── styles/
│   └── globals.css      # Global styles with Tailwind
├── .env.local           # Environment variables
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## App Router Benefits

- **Server Components** by default for better performance
- **Nested Layouts** for shared UI components
- **Loading UI** with built-in loading.tsx
- **Error Handling** with error.tsx capabilities
- **Improved SEO** with metadata API
- **Better Performance** with automatic optimizations

## Dependencies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework

Make sure the backend server is running on the configured URL before starting the frontend.
