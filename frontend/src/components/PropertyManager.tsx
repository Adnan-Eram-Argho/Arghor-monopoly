import React from 'react';
import type { Tile, RoomState, Player } from '../types';

interface PropertyManagerProps {
  tile: Tile;
  room: RoomState;
  player: Player;
  onClose: () => void;
  socket: any;
}

const PropertyManager: React.FC<PropertyManagerProps> = ({ tile, room, player, onClose, socket }) => {
  const isOwner = tile.owner === player.id;
  const groupTiles = room.board.filter(t => t.group === tile.group);
  const ownsAll = groupTiles.every(t => t.owner === player.id && !t.isMortgaged);
  const hasHouses = groupTiles.some(t => t.houses && t.houses > 0);

  const handleMortgage = () => { socket.emit('mortgage_property', { roomId: room.id, tileId: tile.id }); };
  const handleUnmortgage = () => { socket.emit('unmortgage_property', { roomId: room.id, tileId: tile.id }); };
  const handleBuild = () => { socket.emit('build_house', { roomId: room.id, tileId: tile.id }); };
  const handleSell = () => { socket.emit('sell_house', { roomId: room.id, tileId: tile.id }); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel border-t border-white/20 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-[0_40px_80px_rgba(0,0,0,0.9)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        <button onClick={onClose} className="absolute top-5 right-5 text-white/50 hover:text-white text-2xl transition-colors z-10">&times;</button>
        <h2 className="relative z-10 text-3xl font-black mb-1 tracking-wider uppercase drop-shadow-md" style={{ color: tile.color }}>{tile.name}</h2>
        <p className="relative z-10 text-white/50 text-xs mb-6 uppercase tracking-[0.2em] font-medium">{tile.group} | {tile.type}</p>
        
        <div className="relative z-10 space-y-2.5 mb-8 text-sm bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner">
           <div className="flex justify-between font-black text-green-400 text-base border-b border-white/10 pb-2 mb-2"><span>Base Rent</span> <span>৳{tile.rent}</span></div>
           {tile.rentLevels && tile.rentLevels.map((r, i) => (
             <div key={i} className="flex justify-between text-slate-300 font-medium">
               <span>{i === 4 ? 'Hotel' : `${i + 1} House${i !== 0 ? 's' : ''}`} Rent</span>
               <span className="font-bold">৳{r}</span>
             </div>
           ))}
           {tile.houseCost && (
             <div className="flex justify-between mt-3 pt-3 border-t border-white/10 text-yellow-400 font-bold"><span>House Cost</span> <span>৳{tile.houseCost}</span></div>
           )}
           <div className="flex justify-between text-red-400 font-bold mt-1"><span>Mortgage Value</span> <span>৳{Math.floor((tile.price||0)/2)}</span></div>
        </div>

        <div className="relative z-10">
          {isOwner && tile.type === 'PROPERTY' ? (
            <div className="flex flex-col gap-3">
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleBuild} disabled={!ownsAll || (tile.houses||0) >= 5 || tile.isMortgaged} className="glow-btn-blue text-white font-bold py-3 px-2 rounded-xl disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wider">Build House</button>
                  <button onClick={handleSell} disabled={(tile.houses||0) === 0 || tile.isMortgaged} className="bg-orange-600 hover:bg-orange-500 shadow-[0_4px_15px_rgba(234,88,12,0.4)] text-white font-bold py-3 px-2 rounded-xl disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wider">Sell House</button>
               </div>
               
               {!tile.isMortgaged ? (
                 <button onClick={handleMortgage} disabled={hasHouses} className="bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-500/50 py-3 rounded-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed font-black tracking-widest text-sm transition-colors uppercase shadow-[0_4px_15px_rgba(220,38,38,0.3)]">Mortgage ৳{Math.floor((tile.price||0)/2)}</button>
               ) : (
                 <button onClick={handleUnmortgage} className="glow-btn-green text-white font-black py-3 rounded-xl mt-2 tracking-widest text-sm transition-colors uppercase animate-pulse">Unmortgage ৳{Math.floor((tile.price||0)/2) + Math.floor((tile.price||0)*0.05)}</button>
               )}
            </div>
          ) : isOwner ? (
              <div className="flex flex-col gap-3">
                  <p className="text-xs text-center text-white/50 font-medium mb-1">Houses cannot be built on Utilities/Stations.</p>
                  {!tile.isMortgaged ? (
                    <button onClick={handleMortgage} className="w-full bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-500/50 py-3 rounded-xl disabled:opacity-50 font-black tracking-widest text-xs md:text-sm transition-colors uppercase shadow-[0_4px_15px_rgba(220,38,38,0.3)]">Mortgage ৳{Math.floor((tile.price||0)/2)}</button>
                  ) : (
                    <button onClick={handleUnmortgage} className="w-full glow-btn-green text-white font-black py-3 rounded-xl tracking-widest text-xs md:text-sm transition-colors uppercase animate-pulse">Unmortgage ৳{Math.floor((tile.price||0)/2) + Math.floor((tile.price||0)*0.05)}</button>
                  )}
              </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default PropertyManager;
