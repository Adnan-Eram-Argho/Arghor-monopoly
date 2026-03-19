// frontend/src/components/Board.tsx
import React from 'react';
import type { RoomState, Player, Tile as TileType } from '../types';
import TileComponent from './Tile';
import { getTilePosition } from '../utils/boardUtils';

interface BoardProps {
  room: RoomState;
  onTileClick?: (id: number) => void;
}

const Board: React.FC<BoardProps> = ({ room, onTileClick }) => {
  
  // Helper to find players on a specific tile
  const getPlayersAtTile = (tileId: number): Player[] => {
    return room.players.filter(p => p.position === tileId && !p.isBankrupt);
  };

  return (
    <div className="w-full max-w-[900px] aspect-square bg-[#0d1321] p-1.5 md:p-3 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-[6px] border-[#080808] rounded-lg">
      <div className="board-grid gap-0.5 w-full h-full bg-[#080808]">
        
        {/* Render Tiles 0-39 */}
        {room.board.map((tile: TileType) => {
          const pos = getTilePosition(tile.id);
          return (
            <div 
              key={tile.id} 
              style={{ gridRow: pos.row, gridColumn: pos.col }}
              className={`w-full h-full ${onTileClick ? 'cursor-pointer' : ''}`}
              onClick={() => onTileClick && onTileClick(tile.id)}
            >
              <TileComponent tile={tile} playersHere={getPlayersAtTile(tile.id)} />
            </div>
          );
        })}

        {/* Center Space (Logo / Controls) */}
        <div 
          style={{ gridRow: '2 / 11', gridColumn: '2 / 11' }}
          className="bg-[#121f33] flex flex-col items-center justify-center p-4 rounded-xl shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] m-1 md:m-3"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 text-center mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] uppercase tracking-widest">
            Dhoni Hobar<br/>Mojar Khela
          </h1>
          <p className="text-gray-300 font-mono text-sm md:text-lg mb-8 tracking-widest">ROOM: <span className="text-yellow-400 font-bold">{room.id}</span></p>
          
          <div className="mt-4 bg-black/40 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-2xl text-white text-center shadow-xl">
             <p className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#4ade80]">
               Turn: {room.players[room.currentTurnIndex]?.name}
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Board;