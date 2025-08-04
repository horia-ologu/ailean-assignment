# Components Directory

This directory contains reusable React components that have been extracted from the main `page.tsx` file to improve code organization, maintainability, and reusability.

## Component Structure

### Core Components

#### `ErrorAlert.tsx`

- **Purpose**: Displays error messages with a dismiss button
- **Props**:
  - `error: string` - The error message to display
  - `onClose: () => void` - Callback function when error is dismissed
- **Usage**: Used throughout the app for consistent error display

#### `LoadingSpinner.tsx`

- **Purpose**: Shows a loading state while data is being fetched
- **Props**: None
- **Usage**: Displayed while agents are being loaded from the backend

### Form Components

#### `CreateAgentForm.tsx`

- **Purpose**: Accordion-style form for creating new agents with React Hook Form integration
- **Props**:
  - `showCreateForm: boolean` - Controls form visibility
  - `setShowCreateForm: (show: boolean) => void` - Toggle form visibility
  - `onCreateAgent: (data: CreateAgentRequest) => Promise<void>` - Handles form submission
  - `isCreating: boolean` - Shows loading state during creation
- **Features**:
  - Form validation with error messages
  - Accordion-style collapsible interface
  - React Hook Form integration for better performance
  - TypeScript type safety

### List Components

#### `AgentList.tsx`

- **Purpose**: Displays a list of agents with action buttons
- **Props**:
  - `agents: Agent[]` - Array of agents to display
  - `isHotelBot: (agent: Agent) => boolean` - Function to identify hotel bots
  - `onAgentClick: (agent: Agent) => void` - Callback when an agent is clicked
  - `onDeleteClick: (agent: Agent) => void` - Callback when delete is clicked
- **Features**:
  - Protected hotel bot indication
  - Agent type and status badges
  - Click handlers for actions

### Container Components

#### `AgentManagement.tsx`

- **Purpose**: Main container for agent management functionality
- **Props**:
  - `agents: Agent[]` - List of agents
  - `isHotelBot: (agent: Agent) => boolean` - Hotel bot identifier
  - `showCreateForm: boolean` - Form visibility state
  - `setShowCreateForm: (show: boolean) => void` - Form toggle
  - `onCreateAgent: (data: CreateAgentRequest) => Promise<void>` - Create handler
  - `onAgentClick: (agent: Agent) => void` - Agent click handler
  - `onDeleteClick: (agent: Agent) => void` - Delete click handler
  - `isCreating: boolean` - Creation loading state
- **Composition**: Contains `CreateAgentForm` and `AgentList`

#### `AgentChat.tsx`

- **Purpose**: Complete chat interface for interacting with agents
- **Props**:
  - `agents: Agent[]` - Available agents for selection
  - `selectedAgentId: string | null` - Currently selected agent ID
  - `selectedAgentForChat: Agent | null` - Selected agent object
  - `isHotelBot: (agent: Agent) => boolean` - Hotel bot identifier
  - `onAgentSelection: (agentId: string) => void` - Agent selection handler
  - `question: string` - Current question input
  - `setQuestion: (question: string) => void` - Question setter
  - `chatHistory: ChatMessage[]` - Chat conversation history
  - `askingQuestion: boolean` - Loading state for questions
  - `onAskQuestion: (e: React.FormEvent) => void` - Question submission handler
- **Features**:
  - Agent selection dropdown
  - Chat history display with auto-scroll
  - Message input with enter key support
  - Suggested questions for different agent types
  - Loading states and animations

### Modal Components

#### `AgentModal.tsx`

- **Purpose**: Detailed view modal for agent information
- **Props**:
  - `agent: Agent` - The agent to display
  - `isHotelBot: (agent: Agent) => boolean` - Hotel bot identifier
  - `onClose: () => void` - Modal close handler
  - `onDelete: (agent: Agent) => void` - Delete action handler
- **Features**:
  - Complete agent information display
  - Hotel bot capabilities showcase
  - Delete agent functionality
  - Responsive modal design

#### `DeleteConfirmationModal.tsx`

- **Purpose**: Confirmation dialog for agent deletion
- **Props**:
  - `agent: Agent` - Agent to be deleted
  - `onClose: () => void` - Cancel action handler
  - `onConfirm: () => void` - Confirm deletion handler
- **Features**:
  - Warning icon and messaging
  - Agent summary display
  - Cancel/confirm actions
  - Keyboard support (ESC/Enter)

## Benefits of Refactoring

### 1. **Improved Maintainability**

- Each component has a single responsibility
- Easier to locate and modify specific functionality
- Clear separation of concerns

### 2. **Enhanced Reusability**

- Components can be reused across different parts of the application
- Consistent UI patterns and behavior
- Easier to create new features using existing components

### 3. **Better Testing**

- Components can be tested in isolation
- Easier to write unit tests for specific functionality
- Improved test coverage

### 4. **Type Safety**

- All components are fully typed with TypeScript
- Props interfaces ensure correct usage
- Compile-time error checking

### 5. **Development Experience**

- Smaller, focused files are easier to work with
- Clear component hierarchy and data flow
- Better IDE support and IntelliSense

## Usage Example

```tsx
import {
	AgentChat,
	AgentManagement,
	ErrorAlert,
	LoadingSpinner,
	AgentModal,
	DeleteConfirmationModal,
} from '../components'

// In your main component
;<AgentChat
	agents={agents}
	selectedAgentId={selectedAgentId}
	selectedAgentForChat={selectedAgentForChat}
	isHotelBot={isHotelBot}
	onAgentSelection={handleAgentSelection}
	question={question}
	setQuestion={setQuestion}
	chatHistory={chatHistory}
	askingQuestion={askingQuestion}
	onAskQuestion={handleAskQuestion}
/>
```

## File Structure

```
components/
├── index.ts              # Export all components
├── ErrorAlert.tsx        # Error message display
├── LoadingSpinner.tsx    # Loading state component
├── CreateAgentForm.tsx   # Agent creation form
├── AgentList.tsx         # Agent list display
├── AgentManagement.tsx   # Management container
├── AgentChat.tsx         # Chat interface
├── AgentModal.tsx        # Agent details modal
└── DeleteConfirmationModal.tsx # Deletion confirmation
```

All components maintain the same functionality as the original monolithic component while providing better organization and reusability.
