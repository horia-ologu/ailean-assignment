# The Grand Arosa Hotel Q&A API

A production-ready Express.js server in TypeScript that powers **The Grand Arosa Hotel Q&A System**. Features intelligent chatbot capabilities, agent management, and Swiss Alpine hotel-specific information.

## 🏨 Hotel Q&A Bot Features

### **The Grand Arosa Q&A Bot**

- **Intelligent Keyword Matching**: Natural language processing for guest inquiries
- **10 Comprehensive Categories**: Check-in/out, parking, breakfast, WiFi, room service, amenities, spa, location, cancellation
- **Swiss-Specific Information**: CHF pricing, Alpine specialties, 1,800m altitude location
- **Fallback Responses**: Helpful guidance for unmatched questions

### **Sample Q&A Categories**

```typescript
✅ Check-in/Check-out: Times, early/late options, policies
✅ Parking: Underground garage, valet services, pricing
✅ Breakfast: Alpine buffet, hours, mountain views
✅ WiFi: Complimentary access, network details
✅ Room Service: 24/7 availability, mobile app ordering
✅ Amenities: Spa, pool, fitness, ski concierge
✅ Spa Services: Alpine wellness, thermal pools, treatments
✅ Location: Arosa Switzerland, train station, airport access
✅ Cancellation: 48-hour policy, refund terms
```

## 🛠 Technical Architecture

### **Core Components**

- **AgentService**: Business logic for agent CRUD operations
- **Hotel Q&A Engine**: Keyword matching and response generation
- **JSON Database**: File-based persistence (development) / In-memory (production)
- **CORS Middleware**: Cross-origin request handling
- **TypeScript**: Full type safety and modern JavaScript features

### **API Endpoints**

| Method   | Endpoint           | Description              |
| -------- | ------------------ | ------------------------ |
| `GET`    | `/agents`          | Retrieve all agents      |
| `GET`    | `/agents/:id`      | Get specific agent by ID |
| `POST`   | `/agents`          | Create new agent         |
| `PUT`    | `/agents/:id`      | Update existing agent    |
| `DELETE` | `/agents/:id`      | Delete agent             |
| `POST`   | `/agents/:id/chat` | Send message to agent    |

### **Request/Response Examples**

**Create Agent:**

```bash
POST /agents
Content-Type: application/json

{
  "name": "Custom Agent",
  "description": "A helpful custom assistant"
}
```

**Chat with The Grand Arosa Bot:**

```bash
POST /agents/1/chat
Content-Type: application/json

{
  "message": "What time is check-in?"
}

# Response:
{
  "response": "Check-in at The Grand Arosa is from 3:00 PM. Early check-in is available upon request and subject to room availability. Our concierge team will be happy to store your luggage if you arrive early."
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
      "description": "Helpful bot for hotel services",
      "type": "qa-bot",
      "capabilities": ["check-in", "spa", "location", ...],
      "qaData": {
        "keywords": { ... },
        "answers": { ... },
        "fallbackResponse": "..."
      }
    }
  ],
  "metadata": {
    "nextId": 2,
    "lastUpdated": "2025-08-01T05:42:51.645Z",
    "version": "1.0.0"
  }
}
```

### **Agent Model**

```typescript
interface Agent {
	id: string
	name: string
	description?: string
	createdAt: Date
	type?: string
	capabilities?: string[]
	qaData?: {
		keywords: Record<string, string[]>
		answers: Record<string, string>
		fallbackResponse: string
	}
}
```

## 🧠 Q&A Engine Logic

### **Keyword Matching Algorithm**

1. **Input Processing**: Convert user question to lowercase
2. **Category Scanning**: Check each Q&A category for keyword matches
3. **First Match Wins**: Return answer from first matching category
4. **Fallback Response**: Provide helpful guidance if no matches found

### **Example Keyword Matching**

```typescript
Question: "Do you have parking?"
Keywords: ["parking", "park", "car", "vehicle", "garage"]
Match: "parking" found → Return parking information

Question: "Where can I get a massage?"
Keywords: ["spa", "wellness", "massage", "treatment"]
Match: "massage" found → Return spa information
```

### **Extensible Design**

- **Easy Category Addition**: Add new Q&A categories via JSON
- **Keyword Expansion**: Extend keyword lists for better matching
- **Multi-language Support**: Framework ready for internationalization## 🔧 Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Environment Variables

```bash
PORT=3001                    # Server port (default: 3001)
NODE_ENV=production         # Environment mode
```

## 🚀 Deployment

### Railway Deployment

This backend is configured for easy deployment on [Railway](https://railway.app):

#### Railway Configuration (`railway.json`):

```json
{
	"build": {
		"command": "cd backend && npm install && npm run build"
	},
	"start": {
		"command": "cd backend && npm start"
	}
}
```

#### Deployment Steps:

1. **Connect Repository**: Link your GitHub repository to Railway
2. **Configure Build**: Railway will automatically detect the `railway.json` configuration
3. **Environment Variables**: Set production environment variables in Railway dashboard:
   - `NODE_ENV=production`
   - `PORT` (automatically provided by Railway)
4. **Deploy**: Railway will build and deploy automatically

#### Railway Features:

- ✅ **Automatic deployments** from GitHub commits
- ✅ **Environment variable management**
- ✅ **Custom domains** and HTTPS
- ✅ **Monitoring and logs**
- ✅ **Automatic scaling**

The Hotel Q&A Bot will be automatically initialized on Railway startup!nced Hotel Q&A Bot functionality.

## 🏗️ Architecture

This backend follows a clean, modular architecture:

```
backend/src/
├── models/           # TypeScript interfaces and types
│   └── Agent.ts      # Agent model definitions
├── services/         # Business logic layer
│   └── AgentService.ts # Agent management and Hotel Q&A logic
├── controllers/      # Request/response handling
│   └── AgentController.ts # Agent CRUD and question processing
├── routes/           # API route definitions
│   ├── index.ts      # Main router
│   └── agents.ts     # Agent-specific routes
└── index.ts          # Server entry point
```

## 🚀 Features

- ✅ **Production-ready Express server** with TypeScript
- ✅ **Clean architecture** with separation of concerns
- ✅ **In-memory agent storage** with proper data models
- ✅ **Hotel Q&A Bot** with intelligent keyword matching
- ✅ **Restricted /ask endpoint** (Hotel Q&A Bot only)
- ✅ **Advanced Q&A logic** for hotel-related questions
- ✅ **CORS configured** for Vercel frontend deployment
- ✅ **Error handling** and request validation
- ✅ **Graceful shutdown** and proper logging

## 🏨 Hotel Q&A Bot Features

The Hotel Q&A Bot automatically handles questions about:

- **Check-in/Check-out**: Times, early/late options
- **Parking**: Complimentary vs valet options
- **Breakfast**: Continental breakfast details
- **WiFi**: Network access and credentials
- **Room Service**: 24/7 availability and ordering
- **Amenities**: Pool, gym, spa, business center
- **Cancellation**: Policies and refund information

### Keyword Matching Examples:

- "What time is check-in?" → Automatic check-in information
- "Do you have parking?" → Parking options and pricing
- "Is breakfast included?" → Breakfast details and timing

## 📡 API Endpoints

### Base URL: `/api`

| Method | Endpoint          | Description                       |
| ------ | ----------------- | --------------------------------- |
| GET    | `/health`         | Health check                      |
| GET    | `/agents`         | Get all agents                    |
| GET    | `/agents/:id`     | Get specific agent                |
| POST   | `/agents`         | Create new agent                  |
| PUT    | `/agents/:id`     | Update agent                      |
| DELETE | `/agents/:id`     | Delete agent                      |
| POST   | `/agents/:id/ask` | Ask question (Hotel Q&A Bot only) |

### Hotel Q&A Bot Restriction

The `/agents/:id/ask` endpoint **only works with the Hotel Q&A Bot**. Attempts to ask questions to other agents will return:

```json
{
	"error": "Questions can only be asked to the Hotel Q&A Bot",
	"availableBot": "Hotel Q&A Bot"
}
```

}

````

## 🔧 Running the Server

### Development
```bash
npm run dev
````

### Production

```bash
npm run build
npm start
```

### Environment Variables

```bash
PORT=3001                    # Server port (default: 3001)
NODE_ENV=production         # Environment mode
```

## 🌐 CORS Configuration

- **Development**: Allows all origins
- **Production**: Configured for Vercel deployments (`*.vercel.app`) and Railway hosting
- **Custom Domains**: Easily configurable for your specific frontend URL

> **Note**: Update CORS settings in `src/index.ts` if deploying to custom domains other than Vercel.

## 🏨 Hotel Q&A Examples

Try asking the Hotel Q&A Bot:

### Local Development:

```bash
# Check-in time
curl -X POST http://localhost:3001/api/agents/1/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What time can I check in?"}'

# Parking information
curl -X POST http://localhost:3001/api/agents/1/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Do you have parking available?"}'

# WiFi details
curl -X POST http://localhost:3001/api/agents/1/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I connect to WiFi?"}'
```

### Railway Production:

```bash
# Replace YOUR_RAILWAY_URL with your actual Railway deployment URL
curl -X POST https://YOUR_RAILWAY_URL/api/agents/1/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What time is check-in?"}'
```

## 📋 Sample Responses

### Successful Hotel Q&A:

```json
{
	"agentId": "1",
	"agentName": "Hotel Q&A Bot",
	"question": "What time is check-in?",
	"answer": "Our check-in time is 3:00 PM. Early check-in may be available upon request and subject to availability.",
	"timestamp": "2025-01-31T10:30:00.000Z"
}
```

### Fallback Response:

```json
{
	"agentId": "1",
	"agentName": "Hotel Q&A Bot",
	"question": "Random question",
	"answer": "Thank you for your question about \"Random question\". I'm the Hotel Q&A Bot and I can help you with information about check-in/check-out times, parking, breakfast, WiFi, room service, amenities, and cancellation policies...",
	"timestamp": "2025-01-31T10:30:00.000Z"
}
```

## 🛡️ Error Handling

- **400**: Bad Request (missing required fields)
- **403**: Forbidden (asking non-Hotel bot)
- **404**: Not Found (agent doesn't exist)
- **500**: Internal Server Error

The Hotel Q&A Bot is automatically initialized on server startup and is ready to handle questions immediately!
