# Agent Management Frontend

A modern Next.js 14 App Router frontend in TypeScript that provides an elegant chat interface for the **Agent Management System**. Features real-time chat with multiple agent types, comprehensive agent management, and responsive design.

## 🎨 User Experience Features

### **💬 Multi-Agent Chat Interface**

- **Agent Selection**: Dropdown to choose between Sales, Support, Marketing, and Hotel agents
- **Real-time Chat Experience**: Message bubbles with timestamps and user/agent indicators
- **Typing Indicators**: Visual feedback during agent responses (1.5s simulation)
- **Message History**: Persistent conversation tracking per agent within session
- **Auto-scroll**: Automatic scrolling to latest messages
- **Error Handling**: Graceful error messages for inactive agents and server issues

### **🤖 Agent Type Support**

- **Sales Agents**: Product inquiries, pricing, discounts, purchasing support
- **Support Agents**: Technical help, troubleshooting, issue resolution
- **Marketing Agents**: Campaign strategies, branding, social media guidance
- **Hotel Q&A Bot**: The Grand Arosa hotel information and services

### **👥 Agent Management**

- **Agent Grid Display**: Visual card-based agent listing with type and status badges
- **Create New Agents**: Form with name, type (Sales/Support/Marketing), status, and description
- **Agent Status Indicators**: Visual badges for Active/Inactive status with color coding
- **Delete Agents**: One-click agent removal with confirmation modal (hotel bots protected)
- **Agent Details Modal**: Comprehensive information popup with type and status display

### **📱 Agent Details Modal**

- **Full Agent Information**: Name, type, status, description, creation date
- **Visual Type Indicators**: Color-coded badges for Sales (blue), Support (purple), Marketing (orange)
- **Status Display**: Active (green) and Inactive (gray) status indicators
- **Interactive Display**: Click any agent card to view complete details
- **Delete Confirmation**: Custom modal with agent details for safe deletion

## 🛠 Technical Implementation

### **Next.js 14 App Router**

- **Modern Routing**: File-based routing with layouts
- **Server Components**: Optimized performance with React Server Components
- **Client Components**: Interactive UI elements with proper hydration
- **TypeScript**: Full type safety throughout the application

### **State Management**

- **React useState**: Local state for chat messages, agent selection, and UI
- **Agent State**: Real-time agent list updates with type and status tracking
- **Chat State**: Per-agent message history and conversation management
- **Modal State**: Controlled modal display for agent details and deletion
- **Error State**: Graceful error handling with user-friendly messages

### **API Integration**

- **Axios HTTP Client**: Reliable API communication with proper error handling
- **Environment-based URLs**: Automatic backend URL selection for dev/prod
- **Type-safe Requests**: TypeScript interfaces for all API communications
- **Error Handling**: Specific error messages for different failure scenarios

### **Styling & Design**

- **Tailwind CSS**: Utility-first styling framework
- **Custom Components**: Reusable UI components for consistency
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Agent Type Theming**: Color-coded visual indicators for different agent types

## 🎯 Key Components

### **Main Application (`app/page.tsx`)**

```typescript
Features:
✅ Multi-agent chat interface
✅ Agent selection dropdown
✅ Message state management
✅ Typing indicator simulation
✅ Auto-scroll to latest messages
✅ Agent CRUD operations
✅ Error handling and user feedback
```

### **Agent Management System**

```typescript
Features:
✅ Agent creation with type and status
✅ Real-time agent list updates
✅ Visual type and status indicators
✅ Agent details modal
✅ Delete confirmation with protection
✅ Active/Inactive status management
```

### **Chat Interface**

```typescript
Features:
✅ Per-agent conversation history
✅ Real-time message display
✅ Typing indicators and loading states
✅ Error message handling
✅ Agent-specific response styling
```

## 🔧 Environment Configuration

### **Development Setup**

Create `.env.local` file:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### **Production Setup**

```bash
NEXT_PUBLIC_BACKEND_URL=<your-backend-url>
```

## 🚀 Setup Instructions

### **Prerequisites**

```bash
Node.js 18+
npm or yarn
Backend API running on port 3001 (or configured URL)
```

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### **Development**

```bash
# Start development server
npm run dev

# Application will start on http://localhost:3000
```

### **Production Build**

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel deploy
```

## 📊 Agent Types & Features

### **Sales Agent Chat**

```typescript
Features:
- Product information requests
- Pricing inquiries
- Discount negotiations
- Purchase guidance
- Product comparisons

Sample Questions:
- "What's the price for this product?"
- "Do you have any discounts?"
- "I want to buy something"
- "Compare your products"
```

### **Support Agent Chat**

```typescript
Features:
- Technical problem resolution
- User guidance and help
- Issue troubleshooting
- Error resolution
- General support

Sample Questions:
- "I need help with an issue"
- "I'm having a problem"
- "Can you support me?"
- "There's an error"
```

### **Marketing Agent Chat**

```typescript
Features:
- Campaign strategy advice
- Brand development guidance
- Social media marketing
- Target audience analysis
- Marketing insights

Sample Questions:
- "Tell me about your campaigns"
- "Brand development strategies"
- "Social media marketing"
- "Target audience analysis"
```

### **Hotel Q&A Bot**

```typescript
Features:
- Hotel service information
- Check-in/out procedures
- Amenities and facilities
- Location and transportation
- Swiss Alpine hotel details

Sample Questions:
- "What time is check-in?"
- "Do you have a spa?"
- "Where is the hotel located?"
- "Tell me about breakfast"
```

## 🎨 UI/UX Features

### **Agent Type Visual Indicators**

| Type      | Color  | Badge Style                     |
| --------- | ------ | ------------------------------- |
| Sales     | Blue   | `bg-blue-100 text-blue-800`     |
| Support   | Purple | `bg-purple-100 text-purple-800` |
| Marketing | Orange | `bg-orange-100 text-orange-800` |

### **Status Visual Indicators**

| Status   | Color | Badge Style                   |
| -------- | ----- | ----------------------------- |
| Active   | Green | `bg-green-100 text-green-800` |
| Inactive | Gray  | `bg-gray-100 text-gray-800`   |

### **Chat Interface Elements**

- **User Messages**: Right-aligned with blue background
- **Agent Messages**: Left-aligned with gray background
- **Agent Icons**: Type-specific emojis (🏨 for hotel, 🤖 for others)
- **Timestamps**: Formatted for readability
- **Error Messages**: Red-tinted for clear identification

## 🔄 Error Handling

### **API Error Responses**

```typescript
- 403 Forbidden: Agent is inactive
- 404 Not Found: Agent doesn't exist
- 500 Server Error: Backend issues
- Network Error: Connection problems
```

### **User-Friendly Error Messages**

```typescript
- Inactive Agent: "Sorry, I'm currently inactive..."
- Agent Not Found: "Agent not found. Please select..."
- Server Error: "Server error. Please try again..."
- Network Error: "Connection error. Check your internet..."
```

## 🌐 Production Deployment

### **Vercel Configuration**

```json
{
	"buildCommand": "npm run build",
	"outputDirectory": ".next",
	"framework": "nextjs",
	"installCommand": "npm install"
}
```

### **Environment Variables**

```bash
NEXT_PUBLIC_BACKEND_URL=<your-railway-backend-url>
```

### **Build Optimization**

- **Static Generation**: Optimized build with static pages
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting for performance
- **TypeScript Compilation**: Build-time type checking

## 📈 Performance Features

- **React Server Components**: Optimized rendering
- **Static Site Generation**: Fast page loads
- **Code Splitting**: Reduced bundle sizes
- **Lazy Loading**: On-demand component loading
- **Responsive Images**: Optimized for all devices

## 📱 Mobile Responsiveness

- **Mobile-First Design**: Optimized for small screens
- **Touch-Friendly Interface**: Large tap targets
- **Responsive Layout**: Adaptive grid and flexbox
- **Mobile Chat Experience**: Optimized message interface

## 🧪 Testing the Application

### **Agent Creation Testing**

1. **Create Sales Agent**: Test form with Sales type and Active status
2. **Create Support Agent**: Test with Support type and Inactive status
3. **Create Marketing Agent**: Test with Marketing type and description
4. **Form Validation**: Test required fields and type validation

### **Chat Functionality Testing**

1. **Sales Agent Chat**: Test pricing and product questions
2. **Support Agent Chat**: Test help and problem-solving questions
3. **Marketing Agent Chat**: Test campaign and strategy questions
4. **Inactive Agent**: Test error handling for inactive agents
5. **Hotel Bot**: Test hotel-specific questions

### **UI Component Testing**

1. **Agent Selection**: Test dropdown functionality
2. **Message History**: Test per-agent conversation tracking
3. **Modal Display**: Test agent details and delete confirmation
4. **Responsive Design**: Test on mobile and desktop

## 📚 Additional Resources

- **Backend Documentation**: [`/backend/README.md`](../backend/README.md)
- **API Endpoints**: Complete API documentation in backend README
- **TypeScript Types**: Defined in `/services/api.ts`
- **Styling Guide**: Tailwind CSS utilities and custom components

---

**Next.js Frontend for Ailean.io Agent Management System**
