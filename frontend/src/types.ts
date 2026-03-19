// frontend/src/types.ts

export interface Tile {
  id: number;
  name: string;
  type: string;
  group: string;
  price?: number;
  rent?: number;
  houseCost?: number;
  rentLevels?: number[];
  color?: string;
  owner?: string | null;
  houses?: number;
  isMortgaged?: boolean;
}

export interface Player {
  id: string;
  name: string;
  position: number;
  money: number;
  properties: number[];
  inJail: boolean;
  isBankrupt: boolean;
  consecutiveDoubles: number;
  getOutOfJailCards: number;
}

export interface RoomState {
  id: string;
  players: Player[];
  board: Tile[]; 
  currentTurnIndex: number;
  hasRolled: boolean;
  isStarted: boolean;
  logs: string[];
}