
# ForestGPT Technical Overview

## Architecture Overview

ForestGPT is a full-stack web application that provides an AI-powered chatbot interface for US Forest Service information. The application uses a modern React frontend with a Node.js/Express backend.

### Core Technologies

#### Frontend
- **Framework**: React with TypeScript
- **UI Components**: Custom components using Radix UI primitives
- **Styling**: Tailwind CSS with custom forest-themed design system
- **State Management**: React Query for server state, React hooks for local state
- **Router**: Wouter for lightweight routing

#### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: NeonDB (Serverless Postgres) with Drizzle ORM
- **AI Integration**: OpenAI GPT-4 for natural language processing

## Key Components

### Frontend Components

1. **ChatInterface (`ChatInterface.tsx`)**
   - Main chat interface container
   - Manages message state and chat interactions
   - Integrates with trivia and region map features

2. **ChatMessage (`ChatMessage.tsx`)**
   - Renders individual chat messages
   - Supports rich HTML content and source citations

3. **ForestRegionMap (`ForestRegionMap.tsx`)**
   - Interactive US Forest Service regions map
   - Modal-based display with region information

4. **ForestTrivia (`ForestTrivia.tsx`)**
   - Periodic forest-related trivia overlay
   - Configurable display timing and frequency

### Backend Services

1. **LLM Service (`services/llm.ts`)**
   - Manages OpenAI API interactions
   - Processes and formats chat responses
   - Handles token management and response generation

2. **Scraper Service (`services/scraper.ts`)**
   - Web scraping of fs.usda.gov content
   - Image and content extraction
   - Content cleaning and processing

3. **Query Router (`services/query-router.ts`)**
   - Routes user queries to appropriate handlers
   - Manages context and query processing

4. **Source Extractor (`services/source-extractor.ts`)**
   - Extracts and validates information sources
   - Scores and ranks source relevance

## Key Features

1. **AI-Powered Chat**
   - Natural language understanding
   - Context-aware responses
   - Source citation for answers

2. **Interactive Elements**
   - Forest Service regions map
   - Automated forest trivia
   - Responsive design for mobile/desktop

3. **Debug Mode**
   - Token usage monitoring
   - Response timing metrics
   - Raw content preview

## Development Environment

- **Build Tool**: Vite
- **Package Manager**: npm
- **Testing**: Jest
- **Development Server**: Port 5000
- **Deployment**: Replit hosting

## Security & Performance

- Authentication system for protected routes
- Rate limiting for API endpoints
- Efficient content caching
- Optimized image handling
- Secure environment variable management

## Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared types and schemas
└── attached_assets/ # Static assets and documentation
```

This technical overview represents the current state of the ForestGPT application, highlighting its architecture, key components, and technical capabilities.
