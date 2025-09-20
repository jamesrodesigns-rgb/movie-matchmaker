# Movie Matchmaker - Project Analysis

## Overview
Movie Matchmaker is a group-friendly movie recommendation app that allows friends or families to swipe through movie options (Netflix meets Tinder) until everyone agrees on what to watch. Features a dark, cinematic UI with fairness-first logic.

## Current Project State

### Architecture
- **Hybrid Architecture**: Express.js backend + Next.js frontend setup
- **Backend**: Express.js API server (`src/index.js`)
- **Frontend**: Next.js with React 19 and TypeScript
- **UI Development**: Storybook for component development
- **Testing**: Vitest with Playwright integration
- **Styling**: Tailwind CSS

### Technology Stack

#### Core Dependencies
- **Backend**: Express.js 4.18.2, CORS, dotenv
- **Frontend**: Next.js 15.5.3, React 19.1.1, React DOM 19.1.1
- **HTTP Client**: Axios 1.5.0
- **Styling**: Tailwind CSS (configured in globals.css)

#### Development Tools
- **Component Library**: Storybook 9.1.5 with Next.js integration
- **Testing**:
  - Vitest 3.2.4 with browser testing
  - Playwright 1.55.0 for E2E testing
  - Jest 29.7.0 for unit testing
- **Accessibility**: axe-core 4.10.3 with Storybook a11y addon
- **Linting**: ESLint 8.50.0
- **Type Checking**: TypeScript 5.9.2

### Project Structure
```
movie-matchmaker/
├── src/
│   ├── index.js              # Express.js server entry point
│   ├── app/
│   │   └── globals.css       # Tailwind CSS configuration
│   └── stories/              # Storybook components
│       ├── Button.tsx        # Reusable button component
│       ├── GroupCard.stories.tsx  # Group card component
│       ├── Header.tsx        # Header component
│       ├── Page.tsx          # Page component
│       └── assets/           # Static assets
├── .storybook/               # Storybook configuration
├── .claude/                  # Claude AI configuration
└── Configuration files
```

### Configuration Status

#### Complete Configurations
- **Package Management**: npm with package-lock.json
- **Environment**: .env.example with TMDB/OMDB API keys
- **Git**: .gitignore properly configured
- **Storybook**: Full Next.js integration with a11y addon
- **Testing**: Vitest with Playwright browser testing
- **Styling**: Tailwind CSS base configuration

#### Missing Configurations
- **Next.js**: No next.config.js file
- **Tailwind**: No tailwind.config.js file (using defaults)
- **TypeScript**: No tsconfig.json in root
- **ESLint**: No .eslintrc configuration file
- **Playwright**: No playwright.config.js

### API Integration Setup
- **TMDB API**: Environment variable configured for movie data
- **OMDB API**: Environment variable configured for additional movie info
- **Database**: Placeholder for future database integration

### Current Components

#### Storybook Components
- **Button**: Fully typed TypeScript component with size/style variants
- **GroupCard**: Basic card component with accessibility attributes
- **Header/Page**: Standard Storybook template components

#### Component Features
- TypeScript interfaces with proper typing
- Accessibility considerations (ARIA labels, roles)
- CSS-in-JS styling approach in Button component
- Tailwind utility classes in GroupCard

### Development Workflow

#### Available Scripts
- `npm start`: Run production server
- `npm run dev`: Development server with nodemon
- `npm test`: Jest testing
- `npm run lint`: ESLint code checking
- `npm run storybook`: Storybook development server
- `npm run build-storybook`: Build Storybook for production

#### Testing Infrastructure
- **Unit Testing**: Jest for component logic
- **Integration Testing**: Vitest with Storybook integration
- **E2E Testing**: Playwright for browser automation
- **Accessibility Testing**: axe-core integration

### Claude AI Integration

#### MCP Servers Configured
- **Figma Dev Mode**: UI design integration
- **Excalidraw**: Diagramming and wireframing

#### Claude Instructions (.claude/CLAUDE.md)
- Pair-programming focused workflow
- Small, incremental changes preferred
- TypeScript strictness maintained
- Unified diff format for changes
- UI Reviewer subagent for accessibility/usability

### Next Steps for Development

#### Immediate Priorities
1. **Complete Next.js Setup**: Add next.config.js and proper app router structure
2. **Configure Tailwind**: Add tailwind.config.js for custom theming
3. **TypeScript Configuration**: Add root tsconfig.json
4. **Movie API Integration**: Implement TMDB/OMDB API services
5. **Core Components**: Build movie card, swipe interface, group management

#### Architecture Decisions Needed
1. **Frontend Routing**: Determine page structure and navigation
2. **State Management**: Choose between Context API, Zustand, or Redux
3. **Real-time Features**: WebSocket or polling for group synchronization
4. **Database Choice**: SQLite (current app.db), PostgreSQL, or Firebase
5. **Authentication**: User management strategy

#### Development Environment
- **Node Version**: ESM modules configured
- **Package Manager**: npm (package-lock.json present)
- **Git Status**: Clean working directory, recent commits show infrastructure setup

### Code Quality Standards
- TypeScript strict mode expected
- ESLint configuration for code quality
- Prettier likely for code formatting
- Accessibility-first development (axe-core integration)
- Component-driven development with Storybook

### Security Considerations
- Environment variables properly configured
- API keys externalized
- CORS configured for cross-origin requests
- No hardcoded secrets in codebase

---

*This analysis provides a comprehensive overview for AI assistants to understand the current state and begin effective development planning for the Movie Matchmaker project.*