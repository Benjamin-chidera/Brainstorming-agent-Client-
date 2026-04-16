# Project Overview
**BrainStorming-Agents (Client)** is the frontend application for orchestrating interactive AI-driven brainstorming sessions.

### What it does and key features
- **Interactive UI**: Provides a modern, responsive interface for managing AI agent personas.
- **Real-time Visualization**: Connects to WebSockets to stream live discussion transcripts between AI agents.
- **Council Management**: Dynamic forms and components for creating and organizing agent councils.

## Tech Stack
- **Framework**: React 19 + Node.js
- **Tooling**: Vite
- **Styling & UI**: Tailwind CSS v4, Framer Motion, shadcn/ui
- **State Management**: Zustand
- **Real-time Sync**: Socket.IO Client

## Project Structure
```text
Client/
├── src/
│   ├── components/  # React components (UI elements)
│   ├── store/       # Zustand state management
│   ├── types/       # TypeScript type definitions
│   └── main.tsx     # Application entry point
├── package.json     # Project dependencies and scripts
└── vite.config.ts   # Vite bundler configuration
```

## Description
The client acts as the visual representation of the BrainStorming-Agents platform. It enables users to easily initiate multi-perspective AI brainstormings. The interface visually updates in real time utilizing smoothly animated transitions to render live markdown blocks as the autonomous AI meetings occur in the background.

## Environment Variables
This frontend interacts with a local backend server. No specific environment variables are strictly required for the client application to run in its default state, as it communicates out-of-the-box with `localhost:8000`.

## Run Frontend
1. Navigate to the `Client` directory:
   ```bash
   cd Client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   _(The application will be running locally on http://localhost:5173)_

## Key Features
- **Live Transcript Parsing**: Watch generated thoughts dynamically stream and render Markdown.
- **AI Persona Tuning UI**: Mix and match agent definitions via intuitive forms.
- **Responsive Navigation**: Seamlessly switches between agent configurations and live meeting rooms.

## Testing
- **Frontend Testing**: Built atop `vitest`. Run tests inside the `Client/` directory via:
  ```bash
  npm run test
  ```

## Author
_Your Name_

## License
MIT License
