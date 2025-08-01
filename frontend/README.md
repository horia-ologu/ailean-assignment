# The Grand Arosa Hotel Q&A Frontend

A modern Next.js 14 App Router frontend in TypeScript that provides an elegant chat interface for **The Grand Arosa Hotel Q&A System**. Features real-time chat, agent management, and comprehensive hotel information display.

## 🎨 User Experience Features

### **💬 Chat Interface**

- **Real-time Chat Experience**: Message bubbles with timestamps
- **Typing Indicators**: Visual feedback during bot responses (1.5s simulation)
- **Message History**: Persistent conversation tracking within session
- **Auto-scroll**: Automatic scrolling to latest messages
- **Mobile-First Design**: Responsive layout optimized for all devices

### **🤖 The Grand Arosa Q&A Bot**

- **Intelligent Responses**: Powered by keyword-matching backend
- **Swiss Alpine Theme**: Luxury hotel branding and styling
- **Comprehensive Information**: 10+ categories of hotel services
- **Natural Conversation**: Chat-style interaction with helpful fallbacks

### **👥 Agent Management**

- **Agent Grid Display**: Visual card-based agent listing
- **Create New Agents**: Simple form with name and description
- **Delete Agents**: One-click agent removal (except The Grand Arosa Bot)
- **Agent Details Modal**: Comprehensive information popup

### **📱 Agent Details Modal**

- **Full Agent Information**: Name, description, creation date, type
- **Capabilities Grid**: Visual representation of agent functions
- **Category Icons**: Hotel operations, dining, wellness, technology
- **Interactive Display**: Click any agent card to view details

## 🛠 Technical Implementation

### **Next.js 14 App Router**

- **Modern Routing**: File-based routing with layouts
- **Server Components**: Optimized performance with RSC
- **Client Components**: Interactive UI elements
- **TypeScript**: Full type safety throughout

### **State Management**

- **React useState**: Local state for chat messages and UI
- **Message Interface**: Structured message objects with timestamps
- **Agent State**: Real-time agent list updates
- **Modal State**: Controlled modal display and data

### **API Integration**

- **Axios HTTP Client**: Reliable API communication
- **Environment-based URLs**: Automatic backend URL selection
- **Error Handling**: Graceful error states and user feedback
- **CORS Support**: Cross-origin request handling

### **Styling & Design**

- **Tailwind CSS**: Utility-first styling framework
- **Custom Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Alpine Theme**: Luxury hotel visual branding

## 🎯 Key Components

### **Chat Interface (`page.tsx`)**

```typescript
Features:
✅ Message state management
✅ Typing indicator simulation
✅ Auto-scroll to latest messages
✅ Send message functionality
✅ Agent selection dropdown
```

### **Agent Management**

```typescript
Features:
✅ Agent CRUD operations
✅ Real-time agent list updates
✅ Create agent form
✅ Delete agent functionality
✅ Agent details modal
```

### **The Grand Arosa Bot Integration**

```typescript
Features:
✅ Specialized hotel Q&A responses
✅ Swiss-specific information display
✅ Keyword-based response matching
✅ Fallback response handling
```

## 🔧 Environment Configuration

### **Environment Variables**

Create a `.env.local` file with:

```bash
# Primary backend URL (used by default)
NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.up.railway.app

# Alternative configurations (optional)
NEXT_PUBLIC_ONLINE_BACKEND_URL=https://your-railway-app.up.railway.app
NEXT_PUBLIC_LOCAL_BACKEND_URL=http://localhost:3001
```

### **Environment Variable Priority**

The application uses intelligent URL selection:

1. `NEXT_PUBLIC_ONLINE_BACKEND_URL` - Production Railway deployment
2. `NEXT_PUBLIC_BACKEND_URL` - Standard backend URL
3. `NEXT_PUBLIC_LOCAL_BACKEND_URL` - Local development server
4. `http://localhost:3001` - Default fallback

### **Development Scenarios**

**🏠 Full Local Development:**

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
# Both frontend and backend running locally
```

**🌐 Production Testing:**

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.up.railway.app
# Frontend local, backend on Railway
```

**☁️ Full Production:**

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.up.railway.app
# Both frontend and backend deployed
```

## 🚀 Development Setup

### **Prerequisites**

```bash
Node.js 18+ and npm
Backend server running (local or Railway)
```

### **Installation & Startup**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server will start on http://localhost:3000
```

### **Build & Production**

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### **Vercel Deployment (Recommended)**

#### **Option 1: Frontend Directory Deployment**

1. **Connect Repository** to Vercel
2. **Set Root Directory** to `frontend/`
3. **Configure Environment Variables**:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-railway-backend.up.railway.app
   ```
4. **Deploy** - Vercel auto-detects Next.js configuration

#### **Option 2: Monorepo Deployment**

- Deploy from repository root
- Uses `vercel.json` configuration
- Automatically builds from `frontend/` directory

### **Deployment Checklist**

- ✅ Backend deployed and accessible
- ✅ Environment variables configured
- ✅ CORS enabled on backend
- ✅ Frontend build successful
- ✅ API endpoints responding correctly

## 🧪 Testing the Application

### **Sample Interactions**

**Hotel Q&A Testing:**

```
Questions to try:
• "What time is check-in?"
• "Do you have a spa?"
• "Where is the hotel located?"
• "What's included in breakfast?"
• "How do I cancel my reservation?"
• "Do you have parking?"
```

**Agent Management Testing:**

```
Actions to test:
• Create a new agent
• View agent details in modal
• Delete a custom agent
• Try to delete The Grand Arosa Bot (protected)
• Switch between different agents in chat
```

### **UI Features to Verify**

- ✅ Chat messages display correctly
- ✅ Typing indicators appear and disappear
- ✅ Agent modal opens with full details
- ✅ Agent creation form validates properly
- ✅ Delete confirmations work
- ✅ Responsive design on mobile devices

## 📊 Performance Features

### **Optimization Techniques**

- **Next.js App Router**: Optimized routing and rendering
- **Server Components**: Reduced client-side JavaScript
- **Tailwind CSS**: Minimal CSS bundle size
- **Axios Caching**: Efficient API request handling
- **Component Memoization**: Reduced unnecessary re-renders

### **User Experience Enhancements**

- **Loading States**: Visual feedback during API calls
- **Error Boundaries**: Graceful error handling
- **Mobile Responsiveness**: Touch-friendly interface
- **Accessibility**: Semantic HTML and keyboard navigation
- **Real-time Updates**: Immediate UI feedback

---

**🏔️ Experience the luxury of The Grand Arosa through intelligent conversation!**

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
