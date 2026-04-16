# 🎲 Dhoni Game - Bangladesh Monopoly Reskin

A modern, web-based real-time multiplayer board game inspired by Monopoly, reimagined with a vibrant Bangladesh theme. Experience the classic property trading game with localized Bangladeshi locations, BDT currency (scaled 10x), and culturally relevant "Luck" (ভাগ্য) and "Public Fund" (সুযোগ) cards.

![Responsive Design](https://img.shields.io/badge/Responsive-Mobile%20First-brightgreen)
![Real-time](https://img.shields.io/badge/Real--time-Multiplayer-blue)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20Socket.io-orange)

## ✨ Features

- 🌏 **Bangladesh-Themed Board**: Play on a board featuring iconic Bangladeshi locations and landmarks
- 💰 **Local Currency**: All transactions in Bangladeshi Taka (BDT) with 10x scaling for gameplay balance
- 🎴 **Localized Cards**: Experience "Vaggo" (Luck) and "Sujog" (Public Fund) cards with cultural relevance
- 👥 **Real-Time Multiplayer**: Play with friends in real-time using Socket.io
- 📱 **Mobile-First Design**: Fully responsive interface optimized for all devices
- 🔄 **Trading System**: Negotiate and trade properties with other players
- 🏠 **Property Management**: Buy, sell, mortgage, and build houses on your properties
- 🎮 **Interactive Gameplay**: Smooth animations powered by Framer Motion
- 🔊 **Sound Effects**: Immersive audio feedback for game actions

## 🏗️ Project Structure

The project follows a monorepo structure with separate backend and frontend directories:

```
dhoni-game/
├── backend/                 # Node.js + Socket.io game server
│   ├── src/
│   │   ├── data/           # Game data (board layout, cards)
│   │   │   ├── board.ts    # Board tiles configuration
│   │   │   └── cards.ts    # Luck & Public Fund card decks
│   │   ├── logic/          # Core game logic
│   │   │   └── game.ts     # Game rules and calculations
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── index.ts
│   │   └── server.ts       # Express + Socket.io server
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React + Vite client application
│   ├── src/
│   │   ├── components/     # React UI components
│   │   │   ├── Board.tsx              # Main game board
│   │   │   ├── Tile.tsx               # Individual board tiles
│   │   │   ├── PropertyManager.tsx    # Property management UI
│   │   │   ├── TradeModal.tsx         # Trade proposal interface
│   │   │   └── IncomingTradeModal.tsx # Trade acceptance UI
│   │   ├── contexts/       # React contexts
│   │   │   └── SocketContext.tsx      # Socket.io context provider
│   │   ├── utils/          # Utility functions
│   │   │   ├── boardUtils.ts          # Board calculation helpers
│   │   │   └── soundUtils.ts          # Audio playback utilities
│   │   ├── App.tsx         # Main application component
│   │   ├── types.ts        # Shared TypeScript interfaces
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.ts      # Vite build configuration
│
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time Communication**: Socket.io
- **Language**: TypeScript
- **Development**: Nodemon (auto-reload)

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context + Socket.io
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js) or yarn

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd dhoni-game
```

#### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev
```

The backend server will start on `http://localhost:3000`

#### 3. Set Up Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is occupied)

### Playing the Game

1. Open `http://localhost:5173` in your browser
2. Create a new game room or join an existing one using the room code
3. Share the room code with friends to play together
4. Enjoy the game!

**Tip**: To test multiplayer locally, open multiple browser windows or use incognito/private browsing sessions.

## 🎮 How to Play

### Basic Gameplay

1. **Starting**: Each player begins with a set amount of BDT
2. **Turns**: Players take turns rolling dice and moving around the board
3. **Properties**: Land on unowned properties to buy them, or pay rent to the owner
4. **Cards**: Draw "Vaggo" (Luck) or "Sujog" (Public Fund) cards for bonuses or penalties
5. **Trading**: Negotiate property trades with other players
6. **Building**: Build houses on complete property sets to increase rent
7. **Winning**: Be the last player remaining after others go bankrupt

### Game Actions

- **Roll Dice**: Click to roll and move your token
- **Buy Property**: Purchase properties you land on
- **Manage Properties**: Mortgage, unmortgage, build/sell houses via the Property Manager
- **Trade**: Initiate trades with other players using the Trade Modal
- **Chat**: Communicate with other players through the in-game chat

## 🔧 Available Scripts

### Backend (`/backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |

### Frontend (`/frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

## 🐛 Debugging Guide

### Backend Debugging

1. **Server Logs**: Monitor the terminal running `npm run dev` for:
   - Socket connection events
   - Game state changes
   - Error messages

2. **Add Logging**: Insert `console.log()` statements in:
   - `backend/src/logic/game.ts` - Game rule calculations
   - `backend/src/server.ts` - Socket event handlers

3. **Socket Events**: Verify event handling in `server.ts`:
   ```typescript
   socket.on('event_name', (data) => {
     console.log('Received:', data);
     // ... handler logic
   });
   ```

### Frontend Debugging

1. **Browser DevTools** (F12):
   - **Console Tab**: Check for errors and warnings
   - **Network Tab**: Filter by "WS" to monitor WebSocket traffic
   - **Elements Tab**: Inspect DOM and CSS

2. **React DevTools**: Install the [React Developer Tools](https://react.dev/learn/react-developer-tools) extension to:
   - Inspect component hierarchy
   - View props and state
   - Debug rendering issues

3. **Socket Connection Issues**:
   - Verify backend is running on `http://localhost:3000`
   - Check browser console for connection errors
   - Ensure CORS is properly configured

### Common Issues

| Issue | Solution |
|-------|----------|
| Frontend can't connect to backend | Ensure backend is running on port 3000 |
| Room not found | Double-check the room code |
| State not updating | Check WebSocket connection in Network tab |
| Styles not loading | Clear browser cache and restart dev server |

## 🧪 Testing Multiplayer

To test the multiplayer functionality locally:

1. Start both backend and frontend servers
2. Open the game URL in your primary browser window
3. Create a new room
4. Copy the room code
5. Open additional browser windows (regular or incognito)
6. Join the same room using the copied code
7. Play as different users simultaneously

## 📝 Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent formatting (ESLint helps with this)

### Adding New Features

1. **Backend Changes**:
   - Update types in `backend/src/types/index.ts`
   - Add game logic in `backend/src/logic/game.ts`
   - Handle new socket events in `backend/src/server.ts`

2. **Frontend Changes**:
   - Create new components in `frontend/src/components/`
   - Update types in `frontend/src/types.ts`
   - Connect to backend via SocketContext

### Best Practices

- Keep game logic pure and testable
- Use TypeScript strictly (avoid `any`)
- Implement proper error handling
- Test on multiple screen sizes
- Validate all user inputs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Inspired by the classic Monopoly board game
- Built with love for Bangladesh culture and heritage
- Powered by modern web technologies

---

**Happy Gaming! 🎉**

For questions or support, please open an issue in the repository.
