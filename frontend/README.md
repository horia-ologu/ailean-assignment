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
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

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
