# Agent Management System

A full-stack TypeScript application featuring intelligent agent management with multi-type agent support and chat capabilities. Built for **Ailean.io** as a take-home assignment demonstration.

## 🤖 Project Overview

This project implements a sophisticated agent management system with support for **Sales**, **Support**, and **Marketing** agents. The system features:

- **Multi-Agent Chat System** with type-specific responses
- **Agent Management CRUD** operations with status tracking
- **Chat-Style Interface** with typing indicators and message history
- **Agent Details Modal** with comprehensive information display
- **JSON Database** with persistent data storage (local development)
- **Production-Ready Architecture** with Railway + Vercel deployment

## 🎯 Key Features

### 🤖 **Multi-Agent Support**

- **3 Agent Types**: Sales, Support, Marketing with specialized responses
- **Agent Status**: Active/Inactive status management
- **Smart Response System**: Type-specific keyword matching and responses
- **Hotel Q&A Bot**: Specialized bot for The Grand Arosa hotel information

### 💬 **Chat Interface**

- **Real-time Chat Experience**: Message bubbles with timestamps
- **Agent Selection**: Dropdown to choose which agent to chat with
- **Typing Indicators**: Visual feedback during agent responses
- **Message History**: Persistent conversation tracking per agent
- **Error Handling**: Graceful handling of inactive agents and errors

### 👥 **Agent Management**

- **CRUD Operations**: Create, read, update, delete agents
- **Agent Types**: Sales, Support, Marketing with visual indicators
- **Status Management**: Active/Inactive status with visual badges
- **Agent Details Modal**: Comprehensive information display
- **Delete Protection**: Hotel bots are protected from deletion

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

## 📊 Agent Model

### **Agent Structure**

```typescript
interface Agent {
	id: string
	name: string
	type: 'Sales' | 'Support' | 'Marketing'
	status: 'Active' | 'Inactive'
	description?: string
	createdAt: string
}
```

### **Agent Types & Capabilities**

| Type          | Focus                             | Sample Responses                                       |
| ------------- | --------------------------------- | ------------------------------------------------------ |
| **Sales**     | Product info, pricing, purchasing | Price inquiries, product comparisons, discounts        |
| **Support**   | Help, troubleshooting, issues     | Technical problems, user guidance, error resolution    |
| **Marketing** | Campaigns, strategies, branding   | Campaign development, audience targeting, social media |

## 🔄 API Endpoints

| Method   | Endpoint              | Description           | Request Body                            |
| -------- | --------------------- | --------------------- | --------------------------------------- |
| `GET`    | `/api/agents`         | Get all agents        | -                                       |
| `GET`    | `/api/agents/:id`     | Get agent by ID       | -                                       |
| `POST`   | `/api/agents`         | Create new agent      | `{name, type, status, description?}`    |
| `PUT`    | `/api/agents/:id`     | Update agent          | `{name?, type?, status?, description?}` |
| `DELETE` | `/api/agents/:id`     | Delete agent          | -                                       |
| `POST`   | `/api/agents/:id/ask` | Ask question to agent | `{question}`                            |

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
│   ├── services/            # API integration
│   └── types/               # TypeScript types
└── README.md               # This file
```

## 🎮 Usage Examples

### **Chat with Different Agent Types**

1. **Sales Agent**: Ask "What's the price?" or "Can I get a discount?"
2. **Support Agent**: Ask "I need help" or "I have a problem"
3. **Marketing Agent**: Ask "Tell me about campaigns" or "Social media strategy"
4. **Hotel Bot**: Ask "What time is check-in?" or "Do you have a spa?"

### **Agent Management**

1. **Create Agent**: Fill the form with name, type, status, and description
2. **View Details**: Click any agent card to see full information
3. **Delete Agent**: Use the delete button (hotel bots are protected)
4. **Status Management**: Active agents can respond, inactive cannot

## 🧪 Testing Agent Responses

### **Sales Agent Questions**

- "What's the price for this product?"
- "Do you have any discounts?"
- "I want to buy something"
- "Compare your products"

### **Support Agent Questions**

- "I need help with an issue"
- "I'm having a problem"
- "Can you support me?"
- "There's an error"

### **Marketing Agent Questions**

- "Tell me about your campaigns"
- "Brand development strategies"
- "Social media marketing"
- "Target audience analysis"

## 📈 Production Features

- **Status Management**: Inactive agents return appropriate error messages
- **Error Handling**: Graceful error responses with specific messages
- **Agent Protection**: Hotel bots cannot be deleted
- **Type Validation**: Strict validation for agent types and status
- **CORS Configuration**: Properly configured for cross-origin requests

## 📚 Documentation

Detailed setup and functionality documentation available in:

- [`/backend/README.md`](backend/README.md) - Backend API documentation
- [`/frontend/README.md`](frontend/README.md) - Frontend setup and features

---

**Built with ❤️ for Ailean.io**
