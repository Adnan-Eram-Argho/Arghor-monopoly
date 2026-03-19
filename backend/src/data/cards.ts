// backend/src/data/cards.ts
import { Card } from '../types';

export const LUCK_DECK: Card[] = [
  { id: 'l1', text: 'You got a government job!', action: 'GAIN_MONEY', amount: 3000 },
  { id: 'l2', text: 'Traffic jam fine.', action: 'LOSE_MONEY', amount: 500 },
  { id: 'l3', text: 'Eid bonus!', action: 'GAIN_MONEY', amount: 2000 },
  { id: 'l4', text: 'Mobile lost 😭', action: 'LOSE_MONEY', amount: 1000 },
  { id: 'l5', text: 'Advance to Start. Collect 2000 BDT.', action: 'MOVE_TO', position: 0, amount: 2000 },
  { id: 'l6', text: 'Court Order! Go direct to Karagar.', action: 'GO_TO_JAIL' },
];

export const PUBLIC_FUND_DECK: Card[] = [
  { id: 'pf1', text: 'Scholarship payout!', action: 'GAIN_MONEY', amount: 1500 },
  { id: 'pf2', text: 'Medical expense.', action: 'LOSE_MONEY', amount: 1200 },
  { id: 'pf3', text: 'Family support received.', action: 'GAIN_MONEY', amount: 1000 },
  { id: 'pf4', text: 'Tax return.', action: 'GAIN_MONEY', amount: 500 },
  { id: 'pf5', text: 'Get out of Karagar free card.', action: 'GET_OUT_OF_JAIL' },
];

// Utility function to shuffle decks
export const shuffleDeck = (deck: Card[]): Card[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};