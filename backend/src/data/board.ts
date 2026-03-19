// backend/src/data/board.ts
import { Tile } from '../types';

const createProperty = (
  id: number, name: string, group: string, basePrice: number, baseRent: number, 
  color: string, baseHouseCost: number, baseRentLevels: number[]
): Tile => ({
  id, name, type: 'PROPERTY', group: group as any, 
  price: basePrice * 10, rent: baseRent * 10, 
  houseCost: baseHouseCost * 10, rentLevels: baseRentLevels.map(r => r * 10), 
  color, owner: null, houses: 0, isMortgaged: false,
});

const createTile = (id: number, name: string, type: Tile['type'], group: Tile['group'] = 'NONE', basePrice?: number, baseRent?: number): Tile => ({
  id, name, type, group, owner: null, isMortgaged: false, 
  price: basePrice !== undefined ? basePrice * 10 : undefined, 
  rent: baseRent !== undefined ? baseRent * 10 : undefined
});

export const INITIAL_BOARD: Tile[] = [
  // --- BOTTOM ROW (0-10) ---
  createTile(0, 'Start', 'CORNER'),
  createProperty(1, 'Old Dhaka 🚲', 'BROWN', 60, 2, '#8B4513', 50, [10, 30, 90, 160, 250]), 
  createTile(2, 'Public Fund', 'PUBLIC_FUND'),
  createProperty(3, 'Lalbagh', 'BROWN', 60, 4, '#8B4513', 50, [20, 60, 180, 320, 450]),
  createTile(4, 'Income Tax', 'TAX'),
  createTile(5, 'Bangladesh\nRailway', 'STATION', 'STATION', 200, 25),
  createProperty(6, 'Mirpur', 'LIGHT_BLUE', 100, 6, '#87CEEB', 50, [30, 90, 270, 400, 550]), 
  createTile(7, 'Luck', 'LUCK'),
  createProperty(8, 'Mohammadpur', 'LIGHT_BLUE', 100, 6, '#87CEEB', 50, [30, 90, 270, 400, 550]),
  createProperty(9, 'Uttara', 'LIGHT_BLUE', 120, 8, '#87CEEB', 50, [40, 100, 300, 450, 600]),
  createTile(10, 'Karagar / Just Visiting', 'CORNER'),

  // --- LEFT COLUMN (11-20) ---
  createProperty(11, 'Dhanmondi', 'PINK', 140, 10, '#FF69B4', 100, [50, 150, 450, 625, 750]), 
  createTile(12, 'Electricity\nBoard', 'UTILITY', 'UTILITY', 150),
  createProperty(13, 'Banani', 'PINK', 140, 10, '#FF69B4', 100, [50, 150, 450, 625, 750]),
  createProperty(14, 'Gulshan 1', 'PINK', 160, 12, '#FF69B4', 100, [60, 180, 500, 700, 900]),
  createTile(15, 'Metro Rail\n(MRT Line-6)', 'STATION', 'STATION', 200, 25),
  createProperty(16, 'Gulshan 2', 'ORANGE', 180, 14, '#FFA500', 100, [70, 200, 550, 750, 950]), 
  createTile(17, 'Public Fund', 'PUBLIC_FUND'),
  createProperty(18, 'Baridhara', 'ORANGE', 180, 14, '#FFA500', 100, [70, 200, 550, 750, 950]),
  createProperty(19, 'Bashundhara\nR/A', 'ORANGE', 200, 16, '#FFA500', 100, [80, 220, 600, 800, 1000]),
  createTile(20, 'Public Holiday', 'CORNER'),

  // --- TOP ROW (21-30) ---
  createProperty(21, 'Chattogram', 'RED', 220, 18, '#FF0000', 150, [90, 250, 700, 875, 1050]), 
  createTile(22, 'Luck', 'LUCK'),
  createProperty(23, 'Cox\'s Bazar', 'RED', 220, 18, '#FF0000', 150, [90, 250, 700, 875, 1050]),
  createProperty(24, 'Sylhet 🍃', 'RED', 240, 20, '#FF0000', 150, [100, 300, 750, 925, 1100]),
  createTile(25, 'Launch\nTerminal', 'STATION', 'STATION', 200, 25),
  createProperty(26, 'Rajshahi', 'YELLOW', 260, 22, '#FFFF00', 150, [110, 330, 800, 975, 1150]), 
  createProperty(27, 'Khulna', 'YELLOW', 260, 22, '#FFFF00', 150, [110, 330, 800, 975, 1150]),
  createTile(28, 'WASA\n(Water Supply)', 'UTILITY', 'UTILITY', 150),
  createProperty(29, 'Rangpur', 'YELLOW', 280, 24, '#FFFF00', 150, [120, 360, 850, 1025, 1200]),
  createTile(30, 'Court Order', 'CORNER'),

  // --- RIGHT COLUMN (31-39) ---
  createProperty(31, 'Narayanganj 🌊', 'GREEN', 300, 26, '#008000', 200, [130, 390, 900, 1100, 1275]), 
  createProperty(32, 'Gazipur', 'GREEN', 300, 26, '#008000', 200, [130, 390, 900, 1100, 1275]),
  createTile(33, 'Public Fund', 'PUBLIC_FUND'),
  createProperty(34, 'Savar', 'GREEN', 320, 28, '#008000', 200, [150, 450, 1000, 1200, 1400]),
  createTile(35, 'Hazrat Shahjalal\nAirport', 'STATION', 'STATION', 200, 25),
  createTile(36, 'Luck', 'LUCK'),
  createProperty(37, 'Padma Bridge\n🌉', 'DARK_BLUE', 350, 35, '#0000FF', 200, [175, 500, 1100, 1300, 1500]), 
  createTile(38, 'VAT', 'TAX'),
  createProperty(39, 'Bogura', 'DARK_BLUE', 400, 50, '#0000FF', 200, [200, 600, 1400, 1700, 2000]), 
];