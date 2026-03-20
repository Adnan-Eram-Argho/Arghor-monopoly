# Dhoni Game (Bangladesh Monopoly Reskin)

A web-based, real-time multiplayer Monopoly reskin themed around Bangladesh. The game features Bangladesh-specific locations, BDT currency scaled 10x, and localized "Luck" and "Public Fund" cards. It is fully responsive and optimized for mobile devices.

## 🏗️ Detailed File Structure & Explanation

The project is split into two independent parts:

### 1. Backend (`/backend`)
The backend is a Node.js API that uses Socket.io to manage the real-time game state.

```text
backend/
├── package.json         # Backend dependencies and scripts
└── src/
    ├── server.ts        # The main entry point. Sets up Express, initializes Socket.io, and handles all WebSocket events (joining rooms, rolling dice, buying property, trading).
    ├── logic/
    │   └── game.ts      # Contains pure game logic functions (e.g., dice rolling, calculating new positions, rent calculation, executing cards).
    ├── data/
    │   ├── board.ts     # Defines the Monopoly board tiles (properties, taxes, stations) and their respective BDT costs and rents.
    │   └── cards.ts     # Contains the localized "Luck" (Vaggo) and "Public Fund" (Sujog) card decks and shuffle logic.
    └── types/           # TypeScript interfaces and types for the backend (Player, RoomState, Tile).
```

### 2. Frontend (`/frontend`)
The frontend is a React application built with Vite and Tailwind CSS. It connects to the backend and renders the game UI.

```text
frontend/
├── package.json         # Frontend dependencies (React, Socket.io-client, Framer Motion, Tailwind).
├── tailwind.config.js   # Tailwind CSS configuration for styling.
├── index.html           # Main HTML entry file.
└── src/
    ├── main.tsx         # The entry point for React that renders the App component into the DOM.
    ├── App.tsx          # The main application component. Handles Socket connection, room lobby, and renders the game.
    ├── index.css        # Global CSS styles, including Tailwind directives.
    ├── types.ts         # Shared TypeScript interfaces so the frontend knows the shape of RoomState.
    └── components/
        ├── Board.tsx              # Renders the Monopoly grid layout using CSS grid.
        ├── Tile.tsx               # Renders individual spaces on the board (Properties, Go, Jail, etc.).
        ├── PropertyManager.tsx    # Dashboard UI for players to mortgage, unmortgage, build, and sell houses.
        ├── TradeModal.tsx         # UI component used by a player to propose a trade to another player.
        └── IncomingTradeModal.tsx # UI component triggered when a player receives a trade offer, allowing accept/reject.
```

---

## ⚙️ How Each Part Works

### 1. Backend (`/backend`)
The backend is responsible for maintaining the authoritative game state and handling real-time multiplayer interactions.
- **Server (`src/server.ts`)**: Initializes the Express HTTP server and attaches a `Socket.io` instance. It listens for various game events (like `roll_dice`, `buy_property`, `trade_request`) from clients and broadcasts updated game states back to all players in a room.
- **Game State**: Game rooms are stored in memory. Each room tracks players, their balances, properties owned, current turn, and the history log.
- **Game Logic (`src/logic/`)**: Contains pure functions for game rules such as dice rolling, movement calculations, rent calculations, and bankruptcy checks.
- **Data (`src/data/`)**: Stores the initial board layout, property configurations, and localized decks for Luck and Public Fund cards.

### 2. Frontend (`/frontend`)
The frontend is a single-page React application that renders the user interface and interacts with the backend socket server.
- **Components (`src/components/`)**: Reusable React components like the `Board`, `Tile`, and player dashboards. The UI is heavily styled with Tailwind CSS to ensure a mobile-first, responsive experience.
- **State Synchronization**: The frontend connects to the backend via `socket.io-client`. It listens for `game_update` events and replaces its local state with the server's state, ensuring all players see the same board, money balances, and chat logs.

---

## 🚀 How to Install and Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 1. Start the Backend
1. Open a new terminal.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   > The backend should now be running on `http://localhost:3000`. It uses NodeMon, so it will automatically reload if you make changes to the code.

### 2. Start the Frontend
1. Open a second terminal window (keep the backend running).
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > The frontend should now be running, typically on `http://localhost:5173`. Open this URL in your web browser. You can open multiple browser tabs to simulate multiple players joining the same room.

---

## 🐛 How to Debug Each Part

### Debugging the Backend
- **Server Logs**: Look at the terminal where `npm run dev` is running. All socket connection events and server-side errors will appear here.
- **Tracing Logic**: If you want to debug specific game rules (e.g., rent calculation), you can insert `console.log()` statements in `backend/src/logic/game.ts` or `backend/src/server.ts`. Every time an action happens, the logs will print to your terminal.
- **Socket Events**: Verify that socket events are being received and processed correctly by looking at the specific `socket.on(...)` handlers in `server.ts`.

### Debugging the Frontend
- **Browser Developer Tools**: Press `F12` (or right-click and "Inspect") in your browser. 
   - **Console Tab**: Check for any socket connection errors, React rendering warnings, or missing props.
   - **Network Tab**: Filter by `WS` (WebSockets) to monitor the data payloads being sent back and forth between the client and server.
- **React DevTools**: Install the React Developer Tools browser extension. This allows you to inspect the component tree and see the props/state of components like `<Board />` or the main game wrapper to verify if the state from the server is passing down correctly.
- **Socket Connection Issues**: If the frontend isn't connecting to the backend, ensure your socket client in the frontend is pointing to the correct address (e.g., `http://localhost:3000`) and the backend server is actually running.

### Testing Multiplayer
To test multiplayer locally, simply open a browser tab (e.g., normal Chrome window) to create a room. Then, open one or more Incognito/Private tabs navigating to the same URL to join the room using the generated Room Code.
