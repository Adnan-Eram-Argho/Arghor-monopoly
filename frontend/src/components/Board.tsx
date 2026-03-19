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
    <div className="w-full max-w-[900px] aspect-square bg-[#0a0a0a] p-1.5 md:p-3 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.05)] border-[8px] md:border-[12px] border-[#111] rounded-xl relative transform-gpu md:hover:rotate-1 transition-transform duration-700">
      <div className="board-grid gap-0.5 w-full h-full bg-[#050505] shadow-inner">
        
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
          className="bg-[#0f172a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/40 via-[#0f172a] to-black border-2 border-slate-800 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] rounded-3xl m-3 md:m-5 flex flex-col items-center justify-center p-4 md:p-8 text-center relative overflow-hidden"
        >
             {/* Huge Banner Background Text */}
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                <span className="text-[12rem] md:text-[24rem] font-black tracking-tighter text-white rotate-[-25deg] select-none blur-sm">🇧🇩</span>
             </div>

             <div className="glass-panel px-6 py-4 md:px-10 md:py-8 rounded-3xl flex flex-col items-center border border-white/5 shadow-2xl z-10 w-full max-w-[80%]">
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_5px_15px_rgba(234,179,8,0.2)] uppercase tracking-[0.2em] leading-tight mb-2 md:mb-4">
                 Bangladesh<br className="hidden md:block"/><span className="md:hidden"> </span>Monopoly
               </h1>
               
               <p className="text-gray-300 font-mono text-[10px] md:text-xs tracking-widest bg-black/60 px-4 py-1.5 rounded-full border border-white/10 uppercase shadow-inner">Room Code: <span className="text-yellow-400 font-bold ml-1 text-sm md:text-base">{room.id}</span></p>
             </div>

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