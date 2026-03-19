// backend/src/data/board.ts
import { Tile } from '../types';

const createProperty = (
  id: number, name: string, group: string, price: number, rent: number, 
  color: string, houseCost: number, rentLevels: number[]
): Tile => ({
  id, name, type: 'PROPERTY', group: group as any, 
  price, rent, houseCost, rentLevels, 
  color, owner: null, houses: 0, isMortgaged: false,
});

const createTile = (id: number, name: string, type: Tile['type'], group: Tile['group'] = 'NONE', price?: number, rent?: number): Tile => ({
  id, name, type, group, owner: null, isMortgaged: false, 
  price, rent
});

export const INITIAL_BOARD: Tile[] = [
  // --- BOTTOM ROW (0-10) ---
  createTile(0, 'Start', 'CORNER'),
  createProperty(1, 'Old Dhaka 🚲', 'BROWN', 1000, 50, '#8B4513', 500, [200, 600, 1200, 1800, 2500]), 
  createTile(2, 'Public Fund', 'PUBLIC_FUND'),
  createProperty(3, 'Lalbagh', 'BROWN', 1200, 50, '#8B4513', 500, [200, 600, 1200, 1800, 2500]),
  createTile(4, 'Income Tax', 'TAX'),
  createTile(5, 'Bangladesh\nRailway', 'STATION', 'STATION', 4000, 500),
  createProperty(6, 'Mirpur', 'LIGHT_BLUE', 1500, 100, '#87CEEB', 700, [300, 900, 1800, 2500, 3500]), 
  createTile(7, 'Luck', 'LUCK'),
  createProperty(8, 'Mohammadpur', 'LIGHT_BLUE', 1500, 100, '#87CEEB', 700, [300, 900, 1800, 2500, 3500]),
  createProperty(9, 'Uttara', 'LIGHT_BLUE', 2000, 100, '#87CEEB', 700, [300, 900, 1800, 2500, 3500]),
  createTile(10, 'Karagar / Just Visiting', 'CORNER'),

  // --- LEFT COLUMN (11-20) ---
  createProperty(11, 'Dhanmondi', 'PINK', 2500, 200, '#FF69B4', 1000, [600, 1800, 3500, 5000, 7000]), 
  createTile(12, 'Electricity\nBoard', 'UTILITY', 'UTILITY', 3000), // Standardized price somewhat
  createProperty(13, 'Banani', 'PINK', 2500, 200, '#FF69B4', 1000, [600, 1800, 3500, 5000, 7000]),
  createProperty(14, 'Gulshan 1', 'PINK', 3000, 200, '#FF69B4', 1000, [600, 1800, 3500, 5000, 7000]),
  createTile(15, 'Metro Rail\n(MRT Line-6)', 'STATION', 'STATION', 4000, 500),
  createProperty(16, 'Gulshan 2', 'ORANGE', 3500, 300, '#FFA500', 1500, [1000, 3000, 6000, 9000, 12000]), 
  createTile(17, 'Public Fund', 'PUBLIC_FUND'),
  createProperty(18, 'Baridhara', 'ORANGE', 3500, 300, '#FFA500', 1500, [1000, 3000, 6000, 9000, 12000]),
  createProperty(19, 'Bashundhara\nR/A', 'ORANGE', 4000, 300, '#FFA500', 1500, [1000, 3000, 6000, 9000, 12000]),
  createTile(20, 'Public Holiday', 'CORNER'),

  // --- TOP ROW (21-30) ---
  createProperty(21, 'Chattogram', 'RED', 4500, 400, '#FF0000', 2000, [1500, 4000, 8000, 12000, 16000]), 
  createTile(22, 'Luck', 'LUCK'),
  createProperty(23, 'Cox\'s Bazar', 'RED', 4500, 400, '#FF0000', 2000, [1500, 4000, 8000, 12000, 16000]),
  createProperty(24, 'Sylhet 🍃', 'RED', 5000, 400, '#FF0000', 2000, [1500, 4000, 8000, 12000, 16000]),
  createTile(25, 'Launch\nTerminal', 'STATION', 'STATION', 4000, 500),
  createProperty(26, 'Rajshahi', 'YELLOW', 5500, 500, '#FFFF00', 2500, [2000, 5000, 10000, 15000, 20000]), 
  createProperty(27, 'Khulna', 'YELLOW', 5500, 500, '#FFFF00', 2500, [2000, 5000, 10000, 15000, 20000]),
  createTile(28, 'WASA\n(Water Supply)', 'UTILITY', 'UTILITY', 3000),
  createProperty(29, 'Rangpur', 'YELLOW', 6000, 500, '#FFFF00', 2500, [2000, 5000, 10000, 15000, 20000]),
  createTile(30, 'Court Order', 'CORNER'),

  // --- RIGHT COLUMN (31-39) ---
  createProperty(31, 'Narayanganj 🌊', 'GREEN', 6500, 700, '#008000', 3000, [2500, 7000, 14000, 20000, 25000]), 
  createProperty(32, 'Gazipur', 'GREEN', 6500, 700, '#008000', 3000, [2500, 7000, 14000, 20000, 25000]),
  createTile(33, 'Public Fund', 'PUBLIC_FUND'),
  createProperty(34, 'Savar', 'GREEN', 7000, 700, '#008000', 3000, [2500, 7000, 14000, 20000, 25000]),
  createTile(35, 'Hazrat Shahjalal\nAirport', 'STATION', 'STATION', 4000, 500),
  createTile(36, 'Luck', 'LUCK'),
  createProperty(37, 'Padma Bridge\n🌉', 'DARK_BLUE', 8000, 1000, '#0000FF', 4000, [4000, 10000, 20000, 30000, 40000]), 
  createTile(38, 'VAT', 'TAX'),
  createProperty(39, 'Purbachal', 'DARK_BLUE', 10000, 1000, '#0000FF', 4000, [4000, 10000, 20000, 30000, 40000]), 
];