// backend/src/logic/game.ts
import { Player, RoomState, Tile, Card } from '../types';

// 1. Roll Dice Function
export const rollDice = (): [number, number] => {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return [die1, die2];
};

// 2. Calculate New Position
// Returns new position and a boolean indicating if they passed START (Go)
export const calculateNewPosition = (currentPos: number, steps: number): { position: number; passedGo: boolean } => {
  const newPosition = (currentPos + steps) % 40;
  const passedGo = currentPos + steps >= 40;
  return { position: newPosition, passedGo };
};

export const calculateRent = (tile: Tile, board: Tile[], steps: number): number => {
  if (!tile.rent || !tile.owner) return 0;
  
  if (tile.isMortgaged) return 0;

  // Utility Logic
  if (tile.type === 'UTILITY') {
    // Check if owner owns multiple utilities
    const utilitiesOwned = board.filter(t => t.type === 'UTILITY' && t.owner === tile.owner).length;
    return utilitiesOwned >= 2 ? steps * 10 : steps * 4;
  }

  // Station Logic
  if (tile.type === 'STATION') {
    const stationsOwned = board.filter(t => t.type === 'STATION' && t.owner === tile.owner).length;
    return 25 * Math.pow(2, stationsOwned - 1); // 25, 50, 100, 200
  }

  // Property Logic
  if (tile.type === 'PROPERTY') {
    if (tile.houses && tile.houses > 0 && tile.rentLevels) {
      return tile.rentLevels[tile.houses - 1];
    }
    
    // Check Monopoly (owns all properties of this color group)
    const propertyGroup = board.filter(t => t.group === tile.group);
    const ownsAll = propertyGroup.every(t => t.owner === tile.owner);
    
    if (ownsAll && tile.houses === 0) {
      return tile.rent * 2;
    }
  }

  return tile.rent;
};

// 4. Execute Card Action
export const executeCard = (player: Player, card: Card): { log: string } => {
  let log = `${player.name} drew: "${card.text}"`;

  switch (card.action) {
    case 'GAIN_MONEY':
      player.money += card.amount || 0;
      break;
    case 'LOSE_MONEY':
      player.money -= card.amount || 0;
      break;
    case 'MOVE_TO':
      if (card.position !== undefined) {
        player.position = card.position;
      }
      if (card.amount !== undefined) {
        player.money += card.amount;
      }
      break;
    case 'GO_TO_JAIL':
      player.position = 10;
      player.inJail = true;
      break;
    case 'GET_OUT_OF_JAIL':
      player.getOutOfJailCards += 1;
      break;
  }

  return { log };
};

// 5. Check Bankruptcy
export const checkBankruptcy = (player: Player): boolean => {
  return player.money < 0;
};