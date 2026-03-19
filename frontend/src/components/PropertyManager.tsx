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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-600 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
        <h2 className="text-2xl font-black mb-1 tracking-wider uppercase" style={{ color: tile.color }}>{tile.name}</h2>
        <p className="text-slate-400 text-xs mb-4 uppercase tracking-widest">{tile.group} | {tile.type}</p>
        
        <div className="space-y-2 mb-6 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-700">
           <div className="flex justify-between font-bold text-green-400"><span>Base Rent</span> <span>৳{tile.rent}</span></div>
           {tile.rentLevels && tile.rentLevels.map((r, i) => (
             <div key={i} className="flex justify-between text-gray-300">
               <span>{i === 4 ? 'Hotel' : `${i + 1} House${i !== 0 ? 's' : ''}`} Rent</span>
               <span>৳{r}</span>
             </div>
           ))}
           {tile.houseCost && (
             <div className="flex justify-between mt-3 pt-3 border-t border-slate-700 text-yellow-500"><span>House Cost</span> <span>৳{tile.houseCost}</span></div>
           )}
           <div className="flex justify-between text-red-300"><span>Mortgage Value</span> <span>৳{Math.floor((tile.price||0)/2)}</span></div>
        </div>

        {isOwner && tile.type === 'PROPERTY' ? (
          <div className="flex flex-col gap-2">
             <div className="grid grid-cols-2 gap-2">
                <button onClick={handleBuild} disabled={!ownsAll || (tile.houses||0) >= 5 || tile.isMortgaged} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">Build House</button>
                <button onClick={handleSell} disabled={(tile.houses||0) === 0 || tile.isMortgaged} className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">Sell House</button>
             </div>
             
             {!tile.isMortgaged ? (
               <button onClick={handleMortgage} disabled={hasHouses} className="bg-red-900/80 hover:bg-red-800 text-red-200 border border-red-700 py-2 rounded-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-wider text-sm transition-colors uppercase">Mortgage for ৳{Math.floor((tile.price||0)/2)}</button>
             ) : (
               <button onClick={handleUnmortgage} className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 rounded-lg mt-2 tracking-wider text-sm transition-colors uppercase shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse">Unmortgage (৳{Math.floor((tile.price||0)/2) + Math.floor((tile.price||0)*0.05)})</button>
             )}
          </div>
        ) : isOwner ? (
            <div className="flex flex-col gap-2">
                <p className="text-xs text-center text-slate-400 mb-2">Houses cannot be built on Utilities/Stations.</p>
                {!tile.isMortgaged ? (
                  <button onClick={handleMortgage} className="w-full bg-red-900/80 hover:bg-red-800 text-red-200 border border-red-700 py-2 rounded-lg mt-2 disabled:opacity-50 font-bold tracking-wider text-[10px] md:text-sm transition-colors uppercase">Mortgage for ৳{Math.floor((tile.price||0)/2)}</button>
                ) : (
                  <button onClick={handleUnmortgage} className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 rounded-lg mt-2 tracking-wider text-[10px] md:text-sm transition-colors uppercase shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse">Unmortgage (৳{Math.floor((tile.price||0)/2) + Math.floor((tile.price||0)*0.05)})</button>
                )}
            </div>
        ) : null}
      </div>
    </div>
  );
};
export default PropertyManager;
