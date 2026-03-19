// backend/src/types/index.ts

// 1. Tile Types: What kind of board tile is it?
export type TileType = 
  | 'PROPERTY' 
  | 'CORNER' 
  | 'TAX' 
  | 'UTILITY' 
  | 'STATION'
  | 'LUCK' 
  | 'PUBLIC_FUND';

// 2. Color Groups: Used for determining rent and building houses
export type ColorGroup = 
  | 'BROWN' 
  | 'LIGHT_BLUE' 
  | 'PINK' 
  | 'ORANGE' 
  | 'RED' 
  | 'YELLOW' 
  | 'GREEN' 
  | 'DARK_BLUE' 
  | 'UTILITY' 
  | 'STATION' 
  | 'NONE';

export interface Tile {
  id: number;
  name: string;
  type: TileType;
  group: ColorGroup;
  price?: number;         // Purchase cost
  rent?: number;          // Base rent
  houseCost?: number;     // Cost to build 1 house
  rentLevels?: number[];  // [1 house, 2 houses, 3 houses, 4 houses, hotel]
  color?: string;         // CSS color for the tile strip
  owner?: string | null;         // Socket ID of owner, or null
  houses?: number;        // 0-4 houses, 5 = Hotel
  isMortgaged?: boolean | null;
}

// 4. Player Interface: Defines a user in the game
export interface Player {
  id: string;             // Socket ID
  name: string;
  position: number;       // 0-39 index
  money: number;
  properties: number[];   // Array of Tile IDs owned
  inJail: boolean;
  jailTurns: number;
  consecutiveDoubles: number; // Track multiple rolls
  isBankrupt: boolean;
  getOutOfJailCards: number;
}

// 5. Card Interface: For Chance/Community Chest
export interface Card {
  id: string;
  text: string;
  action: 'GAIN_MONEY' | 'LOSE_MONEY' | 'MOVE_TO' | 'MOVE_BACK' | 'GO_TO_JAIL' | 'GET_OUT_OF_JAIL';
  amount?: number;
  position?: number;      // Used for MOVE_TO
}

// 6. Game Room State
export interface RoomState {
  id: string;             // Room Code
  players: Player[];
  board: Tile[];          // The full 40-tile array
  currentTurnIndex: number;
  hasRolled: boolean;
  isStarted: boolean;
  availableCardsVaggo: Card[]; // Shuffled decks
  availableCardsSujog: Card[];
  logs: string[];         // Game history for chat/log panel
}