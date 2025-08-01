# The Grand Arosa Hotel Q&A System

A full-stack TypeScript application featuring an intelligent hotel chatbot with agent management capabilities. Built for **Ailean.io** as a take-home assignment demonstration.

## 🏨 Project Overview

This project implements a sophisticated hotel Q&A system for **The Grand Arosa**, a luxury Alpine resort in Switzerland. The system features:

- **Intelligent Hotel Chatbot** with keyword-based Q&A matching
- **Agent Management System** with CRUD operations
- **Chat-Style Interface** with typing indicators and message history
- **Agent Details Modal** with comprehensive capability information
- **JSON Database** with persistent data storage (local development)
- **Production-Ready Architecture** with Railway + Vercel deployment

## 🎯 Key Features

### 🤖 **The Grand Arosa Q&A Bot**

- **10 Comprehensive Q&A Categories**: Check-in/out, parking, breakfast, WiFi, room service, amenities, spa, location, cancellation
- **Smart Keyword Matching**: Natural language processing for guest questions
- **Swiss-Specific Information**: CHF pricing, Alpine specialties, mountain views
- **Fallback Responses**: Helpful guidance when questions don't match keywords

### � **Chat Interface**

- **Real-time Chat Experience**: Message bubbles with timestamps
- **Typing Indicators**: Visual feedback during bot responses
- **Message History**: Persistent conversation tracking
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 👥 **Agent Management**

- **CRUD Operations**: Create, read, update, delete agents
- **Agent Details Modal**: Comprehensive information display
- **Capability Grid**: Visual representation of agent functions
- **Persistent Storage**: JSON database for data persistence

## 🛠 Technology Stack

### **Backend**

- **Express.js** with TypeScript
- **JSON File Database** (development) / **In-Memory** (production)
- **CORS** configuration for cross-origin requests
- **Railway** deployment with automatic builds

### **Frontend**

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Vercel** deployment with environment variables

## 🚀 Quick Start

### **Prerequisites**

```bash
Node.js 18+ and npm
```

### **Backend Setup**

```bash
cd backend
npm install
npm run dev    # Development server on :3001
```

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev    # Development server on :3000
```

### **Environment Configuration**

**Backend** (`.env.local`):

```bash
PORT=3001
NODE_ENV=development
```

**Frontend** (`.env.local`):

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 🌐 Deployment

### **Backend (Railway)**

- **Root Directory**: `backend/`
- **Environment Variable**: `PORT=3001`
- **Auto-Build**: Configured via `railway.json`

### **Frontend (Vercel)**

- **Root Directory**: `frontend/`
- **Environment Variables**:
  ```bash
  NEXT_PUBLIC_BACKEND_URL=<your-railway-backend-url>
  ```

### **Deployment URLs**

- **Backend**: Railway auto-generated URL
- **Frontend**: Vercel auto-generated URL

## 📁 Project Structure

```
ailean-assignment/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/          # TypeScript interfaces
│   │   ├── routes/          # Express routes
│   │   └── services/        # Business logic
│   ├── lib/
│   │   └── agents-db.json   # JSON database
│   └── railway.json         # Railway deployment config
├── frontend/                # Next.js App Router frontend
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   └── types/               # TypeScript types
└── README.md               # This file
```

## 🎮 Usage

1. **Start the Application**: Run both backend and frontend servers
2. **Interact with The Grand Arosa Bot**: Ask questions about hotel services
3. **Manage Agents**: Create, view, and delete agents via the interface
4. **View Agent Details**: Click on agents to see comprehensive information
5. **Test Q&A System**: Try questions like "What time is check-in?" or "Do you have a spa?"

## 🧪 Testing the Q&A Bot

Try these sample questions:

- "What time is check-in?"
- "Do you have parking?"
- "Tell me about the spa"
- "Where is the hotel located?"
- "What's included in breakfast?"
- "How do I cancel my reservation?"

## 📈 Production Considerations

- **File System Limitations**: Railway doesn't support file writes, so production uses in-memory storage
- **CORS Configuration**: Properly configured for cross-origin requests
- **Environment Variables**: Separate configs for development and production
- **Error Handling**: Comprehensive error handling throughout the application

## 📚 Documentation

Detailed setup and functionality documentation available in:

- [`/backend/README.md`](backend/README.md) - Backend API documentation
- [`/frontend/README.md`](frontend/README.md) - Frontend setup and features

---

**Built with ❤️ for Ailean.io**
