# Agent Management API

A production-ready Express.js server in TypeScript that powers the **Agent Management System**. Features multi-agent chat capabilities with type-specific responses for Sales, Support, and Marketing agents.

## 🤖 Agent System Features

### **Multi-Agent Support**

- **3 Agent Types**: Sales, Support, Marketing with specialized responses
- **Status Management**: Active/Inactive agent status tracking
- **Smart Response System**: Type-specific keyword matching and intelligent responses
- **Hotel Q&A Integration**: Specialized responses for The Grand Arosa hotel bot

### **Agent Response Categories**

```typescript
Sales Agent:
✅ Pricing inquiries and product information
✅ Discount and promotion assistance
✅ Purchase guidance and product comparisons
✅ Sales consultation and recommendations

Support Agent:
✅ Technical problem resolution
✅ User guidance and troubleshooting
✅ Error handling and issue resolution
✅ General help and support assistance

Marketing Agent:
✅ Campaign strategy development
✅ Brand positioning and messaging
✅ Social media marketing guidance
✅ Target audience analysis and insights

Hotel Q&A Bot:
✅ Check-in/out procedures and timing
✅ Amenities and services information
✅ Location and transportation details
✅ Spa, dining, and facility inquiries
```

## 🛠 Technical Architecture

### **Core Components**

- **AgentService**: Business logic for agent CRUD operations and response generation
- **Multi-Agent Response Engine**: Type-specific keyword matching and response generation
- **JSON Database**: File-based persistence (development) / In-memory (production)
- **CORS Middleware**: Cross-origin request handling
- **TypeScript**: Full type safety and modern JavaScript features

### **Agent Model**

```typescript
interface Agent {
	id: string
	name: string
	type: 'Sales' | 'Support' | 'Marketing'
	status: 'Active' | 'Inactive'
	description?: string
	createdAt: Date
}

interface CreateAgentRequest {
	name: string
	type: 'Sales' | 'Support' | 'Marketing'
	status: 'Active' | 'Inactive'
	description?: string
}
```

### **API Endpoints**

| Method   | Endpoint              | Description              | Request Body                  |
| -------- | --------------------- | ------------------------ | ----------------------------- |
| `GET`    | `/api/agents`         | Retrieve all agents      | -                             |
| `GET`    | `/api/agents/:id`     | Get specific agent by ID | -                             |
| `POST`   | `/api/agents`         | Create new agent         | `CreateAgentRequest`          |
| `PUT`    | `/api/agents/:id`     | Update existing agent    | `Partial<CreateAgentRequest>` |
| `DELETE` | `/api/agents/:id`     | Delete agent             | -                             |
| `POST`   | `/api/agents/:id/ask` | Ask question to agent    | `{question: string}`          |
| `GET`    | `/api/health`         | Health check endpoint    | -                             |

### **Request/Response Examples**

**Create Sales Agent:**

```bash
POST /api/agents
Content-Type: application/json

{
  "name": "Sales Assistant Pro",
  "type": "Sales",
  "status": "Active",
  "description": "Advanced sales support agent"
}
```

**Ask Question to Sales Agent:**

```bash
POST /api/agents/2/ask
Content-Type: application/json

{
  "question": "What's the price for your premium package?"
}

# Response:
{
  "agentId": "2",
  "agentName": "Sales Assistant Pro",
  "question": "What's the price for your premium package?",
  "answer": "I'd be happy to help you with pricing information. Please let me know which specific product or service you're interested in, and I can provide you with detailed pricing options.",
  "timestamp": "2025-08-01T12:00:00.000Z"
}
```

**Ask Question to Inactive Agent:**

```bash
POST /api/agents/3/ask
Content-Type: application/json

{
  "question": "Can you help me?"
}

# Error Response (403):
{
  "error": "Agent \"Marketing Bot\" is currently inactive and cannot answer questions",
  "agentType": "Marketing",
  "status": "Inactive"
}
```

## 🗃 Database Structure

### **JSON Database Schema**

```json
{
	"agents": [
		{
			"id": "1",
			"name": "The Grand Arosa Q&A Bot",
			"type": "Support",
			"status": "Active",
			"description": "Hotel information and services bot",
			"createdAt": "2025-07-31T21:00:00.000Z"
		},
		{
			"id": "2",
			"name": "Sales Assistant",
			"type": "Sales",
			"status": "Active",
			"description": "Product sales and pricing support",
			"createdAt": "2025-08-01T10:00:00.000Z"
		},
		{
			"id": "3",
			"name": "Marketing Bot",
			"type": "Marketing",
			"status": "Inactive",
			"description": "Marketing strategy and campaign support",
			"createdAt": "2025-08-01T11:00:00.000Z"
		}
	],
	"metadata": {
		"nextId": 4,
		"lastUpdated": "2025-08-01T12:00:00.000Z",
		"version": "1.0.0"
	}
}
```

## 🚀 Setup Instructions

### **Prerequisites**

```bash
Node.js 18+
npm or yarn
```

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### **Environment Configuration**

Create `.env.local` file:

```bash
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### **Development**

```bash
# Start development server with hot reload
npm run dev

# Server will start on http://localhost:3001
```

### **Production Build**

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## 🔧 Agent Response System

### **Sales Agent Keywords & Responses**

```typescript
Keywords: price, product, buy, discount, compare
Responses: Pricing guidance, product information, purchase assistance
```

### **Support Agent Keywords & Responses**

```typescript
Keywords: help, problem, issue, support, error
Responses: Troubleshooting, issue resolution, user guidance
```

### **Marketing Agent Keywords & Responses**

```typescript
Keywords: campaign, brand, social, audience, strategy
Responses: Campaign development, branding, social media guidance
```

### **Hotel Bot Integration**

```typescript
Keywords: check-in, parking, spa, breakfast, wifi, etc.
Responses: Swiss Alpine hotel information, amenities, services
```

## 📊 Error Handling

### **Status Codes**

| Code  | Description  | Example                 |
| ----- | ------------ | ----------------------- |
| `200` | Success      | Agent response returned |
| `201` | Created      | New agent created       |
| `400` | Bad Request  | Missing required fields |
| `403` | Forbidden    | Agent is inactive       |
| `404` | Not Found    | Agent doesn't exist     |
| `500` | Server Error | Internal server error   |

### **Error Response Format**

```json
{
	"error": "Error message",
	"agentType": "Sales",
	"status": "Inactive"
}
```

## 🌐 Production Deployment

### **Railway Configuration**

Create `railway.json`:

```json
{
	"$schema": "https://railway.app/railway.schema.json",
	"build": {
		"builder": "nixpacks"
	},
	"deploy": {
		"numReplicas": 1,
		"restartPolicyType": "ON_FAILURE"
	}
}
```

### **Environment Variables**

```bash
PORT=3001
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

### **Production Considerations**

- **File System**: Railway doesn't support file writes, uses in-memory storage
- **CORS**: Configured for frontend domain
- **Error Handling**: Comprehensive error responses
- **Health Check**: `/api/health` endpoint for monitoring

## 📈 Testing

### **Manual Testing**

```bash
# Health check
curl http://localhost:3001/api/health

# Get all agents
curl http://localhost:3001/api/agents

# Ask question to active agent
curl -X POST http://localhost:3001/api/agents/1/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What time is check-in?"}'

# Ask question to inactive agent (should return 403)
curl -X POST http://localhost:3001/api/agents/3/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Can you help me?"}'
```

## 📚 Additional Resources

- **Frontend Documentation**: [`/frontend/README.md`](../frontend/README.md)
- **API Testing**: Use Postman or curl for endpoint testing
- **Database Backup**: Original complex database available as `agents-db.json.backup`

---

**Express.js Backend for Ailean.io Agent Management System**
