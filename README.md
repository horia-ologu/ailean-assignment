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
- **TypeScript** for type safety and complete component interfaces
- **Tailwind CSS** for responsive styling
- **React Hook Form** for form validation and management
- **Component-Based Architecture** with 8 reusable components
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
npm test         # Run test suite (13 tests)
npm run dev      # Development server on :3001
npm run build    # Production build
npm start        # Production server
```

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev      # Development server on :3000
npm run build    # Production build
npm run lint     # Code linting
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
│   │   ├── services/        # Business logic & agent responses
│   │   └── tests/           # Jest test suite (13 tests)
│   ├── lib/
│   │   └── agents-db.json   # JSON database
│   └── railway.json         # Railway deployment config
├── frontend/                # Next.js App Router frontend
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable React components (8 components)
│   │   ├── AgentChat.tsx    # Chat interface with typing indicators
│   │   ├── AgentList.tsx    # Agent grid display
│   │   ├── AgentManagement.tsx  # Agent management container
│   │   ├── AgentModal.tsx   # Agent details modal
│   │   ├── CreateAgentForm.tsx  # Form with React Hook Form
│   │   ├── DeleteConfirmationModal.tsx  # Deletion confirmation
│   │   ├── ErrorAlert.tsx   # Error message component
│   │   ├── LoadingSpinner.tsx   # Loading state component
│   │   ├── index.ts         # Component exports
│   │   └── README.md        # Component documentation
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

### **Frontend Architecture**

- **Component-Based Design**: 8 modular, reusable React components
- **Form Validation**: React Hook Form with comprehensive validation rules
- **Type Safety**: Full TypeScript interfaces across all components
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Auto-scroll Chat**: Automatic message scrolling and typing indicators

### **Backend Reliability**

- **Status Management**: Inactive agents return appropriate error messages
- **Error Handling**: Graceful error responses with specific messages
- **Agent Protection**: Hotel bots cannot be deleted
- **Type Validation**: Strict validation for agent types and status
- **CORS Configuration**: Properly configured for cross-origin requests
- **Test Coverage**: 13 Jest tests covering all API endpoints and functionality

### **Development & Testing**

- **Hot Reload**: Development servers with automatic reloading
- **Type Checking**: Strict TypeScript compilation
- **Linting**: Code quality enforcement
- **Test Suite**: Comprehensive backend testing with Jest

## 📚 Documentation

### **Project Documentation**

- **Main README**: Complete project overview and setup instructions
- **Backend Documentation**: [`/backend/README.md`](backend/README.md) - Express.js API with 13 Jest tests
- **Frontend Documentation**: [`/frontend/README.md`](frontend/README.md) - Next.js setup with component architecture
- **Component Documentation**: [`/frontend/components/README.md`](frontend/components/README.md) - Detailed component usage guide

### **Architecture Documentation**

- **Component-Based Frontend**: 8 modular React components with TypeScript interfaces
- **API Documentation**: Complete endpoint reference with request/response examples
- **Testing Coverage**: Backend test suite with 13 comprehensive tests
- **Development Workflow**: Setup, testing, and deployment procedures

### **Key Features Overview**

1. **Multi-Agent Chat System**: Sales, Support, Marketing, and Hotel Q&A agents
2. **Form Validation**: React Hook Form with comprehensive validation rules
3. **Component Architecture**: Modular, reusable components with centralized exports
4. **Type Safety**: Full TypeScript implementation across frontend and backend
5. **Testing**: Comprehensive Jest test suite covering all API functionality
6. **Production Ready**: Deployed backend with Railway, frontend with Vercel

---

**Built with ❤️ for Ailean.io**
