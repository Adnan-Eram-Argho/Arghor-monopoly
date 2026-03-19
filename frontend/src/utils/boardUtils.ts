// frontend/src/utils/boardUtils.ts

interface GridPosition {
  row: number;
  col: number;
}

// Maps tile index (0-39) to an 11x11 CSS Grid position
// 0 = Start (Bottom Right), moves clockwise
export const getTilePosition = (index: number): GridPosition => {
  // Corner indices
  if (index === 0) return { row: 11, col: 11 }; // Start (Bottom Right)
  if (index === 10) return { row: 11, col: 1 }; // Jail (Bottom Left)
  if (index === 20) return { row: 1, col: 1 };  // Free Parking (Top Left)
  if (index === 30) return { row: 1, col: 11 }; // Go To Jail (Top Right)

  // Bottom Row (1-9): Right to Left
  if (index >= 1 && index <= 9) return { row: 11, col: 11 - index };

  // Left Column (11-19): Bottom to Top
  // Index 11 is above 10. Row 10, Col 1.
  if (index >= 11 && index <= 19) return { row: 11 - (index - 10), col: 1 };

  // Top Row (21-29): Left to Right
  // Index 21 is right of 20. Row 1, Col 2.
  if (index >= 21 && index <= 29) return { row: 1, col: (index - 20) + 1 };

  // Right Column (31-39): Top to Bottom
  // Index 31 is below 30. Row 2, Col 11.
  if (index >= 31 && index <= 39) return { row: (index - 30) + 1, col: 11 };

  return { row: 0, col: 0 }; // Fallback
};

export type TileOrientation = 'BOTTOM' | 'LEFT' | 'TOP' | 'RIGHT' | 'CORNER';

export const getTileOrientation = (index: number): TileOrientation => {
  if (index === 0 || index === 10 || index === 20 || index === 30) return 'CORNER';
  if (index >= 1 && index <= 9) return 'BOTTOM';
  if (index >= 11 && index <= 19) return 'LEFT';
  if (index >= 21 && index <= 29) return 'TOP';
  if (index >= 31 && index <= 39) return 'RIGHT';
  return 'BOTTOM';
};