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
          className="bg-gradient-to-br from-[#05402f] to-[#7f1d1d] border-[3px] md:border-[6px] border-yellow-500/80 rounded-2xl md:rounded-3xl m-2 md:m-4 flex flex-col items-center justify-center p-2 md:p-6 text-center shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden"
        >
             {/* Huge Banner Background Text */}
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <span className="text-[12rem] md:text-[24rem] font-black tracking-tighter text-white rotate-[-45deg] select-none">🇧🇩</span>
             </div>

             <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] uppercase tracking-widest z-10 pb-2">
               Bangladesh<br className="hidden md:block"/><span className="md:hidden"> </span>Monopoly
             </h1>
             
             <p className="text-gray-300 font-mono text-[10px] md:text-sm mb-2 md:mb-4 tracking-widest z-10 bg-black/50 px-3 py-1 rounded-full border border-white/10 uppercase">Room: <span className="text-yellow-400 font-bold ml-1">{room.id}</span></p>

             {/* Animated Action Banner */}
             {room.logs.length > 0 && (
                <div key={room.logs[room.logs.length - 1]} className="animate-bounce z-10 bg-black/90 p-3 md:p-5 rounded-xl md:rounded-2xl border-2 border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.5)] backdrop-blur-md text-white font-bold text-[10px] md:text-sm lg:text-lg w-[90%] md:max-w-[80%] mx-auto mt-2 md:mt-4 uppercase tracking-wide flex items-center justify-center gap-2">
                   <span className="text-lg md:text-2xl animate-pulse">📢</span>
                   <span>{room.logs[room.logs.length - 1]}</span>
                </div>
             )}
        </div>

      </div>
    </div>
  );
};

export default Board;