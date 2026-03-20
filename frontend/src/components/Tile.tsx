import React from 'react';
import { motion } from 'framer-motion';
import type { Tile as TileType, Player } from '../types';
import { getTileOrientation } from '../utils/boardUtils';

interface TileProps {
  tile: TileType;
  playersHere: Player[];
  allPlayers: Player[];
}

const getPlayerColor = (id: string, allPlayers: Player[]) => {
  const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
  const index = allPlayers.findIndex(p => p.id === id);
  return colors[index % colors.length];
};

const Tile: React.FC<TileProps> = ({ tile, playersHere, allPlayers }) => {
  const orientation = getTileOrientation(tile.id);
  const isMortgaged = tile.isMortgaged;
  const bgColor = isMortgaged ? 'bg-slate-300' : 'bg-[#e9f2e9]';
  
  let layoutClass = 'flex flex-col';
  let barClass = 'h-1/4 w-full border-b-2 border-[#090909]';
  let textContainerClass = 'flex-1 flex flex-col items-center justify-center overflow-hidden w-full h-full p-0.5';
  let titleClass = 'text-[4.5px] sm:text-[6px] md:text-[8px] lg:text-[9px] leading-[1.1] font-black text-center uppercase text-slate-900 w-full px-0.5 break-words whitespace-pre-wrap tracking-tighter';
  let priceClass = 'text-[5px] sm:text-[6.5px] md:text-[8px] lg:text-[9px] font-bold text-slate-800 mt-[1px] whitespace-nowrap bg-white/50 px-[2px] rounded-sm shadow-sm';
  let innerTransform = '';

  // Helper flags to render Name/Price differently for Left/Right edges
  let isSideTile = false;
  let reverseSideOrder = false;

  if (orientation === 'TOP') {
    layoutClass = 'flex flex-col';
    innerTransform = 'rotate-180';
    textContainerClass = 'flex-1 flex flex-col items-center justify-between py-1 overflow-hidden w-full h-full';
  } else if (orientation === 'LEFT') {
    layoutClass = 'flex flex-row-reverse';
    barClass = 'w-1/4 h-full border-l-2 border-[#090909]';
    textContainerClass = 'flex-1 flex flex-row items-center justify-between px-1 overflow-hidden w-full h-full';
    titleClass += ' [writing-mode:vertical-rl] rotate-180';
    priceClass += ' [writing-mode:vertical-rl] rotate-180 text-center';
    isSideTile = true;
    reverseSideOrder = true; // Price on Left, Name on Right
  } else if (orientation === 'RIGHT') {
    layoutClass = 'flex flex-row';
    barClass = 'w-1/4 h-full border-r-2 border-[#090909]';
    textContainerClass = 'flex-1 flex flex-row items-center justify-between px-1 overflow-hidden w-full h-full';
    titleClass += ' [writing-mode:vertical-rl]';
    priceClass += ' [writing-mode:vertical-rl] text-center';
    isSideTile = true;
  } else if (orientation === 'CORNER') {
    if (tile.id === 10) innerTransform = 'rotate-90';
    if (tile.id === 20) innerTransform = 'rotate-180';
    if (tile.id === 30) innerTransform = '-rotate-90';
    titleClass = 'text-[5.5px] sm:text-[7px] md:text-[9px] lg:text-[10px] leading-tight font-black text-center uppercase text-slate-900 px-0.5 break-words';
    textContainerClass = 'flex-1 flex flex-col items-center justify-center p-1 overflow-hidden w-full h-full';
  } else {
    // BOTTOM
    textContainerClass = 'flex-1 flex flex-col items-center justify-between py-1 overflow-hidden w-full h-full';
  }

  // Common components
  const NameElement = <span className={titleClass}>{tile.name}</span>;
  const PriceElement = tile.price ? <span className={priceClass}>৳{tile.price}</span> : null;
  const IconElement = tile.type === 'LUCK' ? <span className={`text-lg md:text-2xl my-1 flex items-center justify-center ${orientation === 'LEFT' || orientation === 'RIGHT' ? 'rotate-90' : ''}`}>🎲</span> :
                      tile.type === 'PUBLIC_FUND' ? <span className={`text-lg md:text-2xl my-1 flex items-center justify-center ${orientation === 'LEFT' || orientation === 'RIGHT' ? 'rotate-90' : ''}`}>🎁</span> : null;

  return (
    <div className={`relative w-full h-full border border-[#1a1a1a] ${bgColor} group transition-all duration-300 hover:z-50 hover:scale-[1.2] hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_0_15px_rgba(255,255,255,0.4)] shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]`}>
      <div className={`absolute inset-0 ${layoutClass} ${innerTransform}`}>
        
        {tile.type === 'PROPERTY' && (
          <div className={`${barClass} shadow-[0_2px_5px_rgba(0,0,0,0.3),inset_0_2px_5px_rgba(255,255,255,0.5)] relative flex items-center justify-center border-b border-black/20`} style={{ backgroundColor: tile.color }}>
            {tile.houses !== undefined && tile.houses > 0 && (
              <div className={`absolute flex ${orientation === 'LEFT' || orientation === 'RIGHT' ? 'flex-col' : 'flex-row'} items-center justify-center gap-[1px] md:gap-1 z-10`}>
                {tile.houses === 5 ? (
                  <div className="w-[6px] h-[6px] sm:w-2 sm:h-2 md:w-3.5 md:h-3.5 bg-red-600 shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-black rounded-[1px]" title="Hotel" />
                ) : (
                  Array.from({ length: tile.houses }).map((_, i) => (
                     <div key={i} className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] md:w-2.5 md:h-2.5 bg-green-500 shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-black rounded-[0.5px]" title="House" />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {isMortgaged && (
          <div className="absolute inset-0 bg-red-900/60 z-20 flex items-center justify-center backdrop-blur-[2px]">
             <span className={`text-red-400 font-black text-[4.5px] sm:text-[6px] md:text-[10px] tracking-widest uppercase border-y-[0.5px] border-red-500 bg-black/95 px-1 py-0.5 shadow-[0_0_10px_rgba(220,38,38,0.8)] ${orientation === 'LEFT' ? 'rotate-90' : orientation === 'RIGHT' ? '-rotate-90' : ''}`}>MORTGAGED</span>
          </div>
        )}

        <div className={textContainerClass}>
           {isSideTile ? (
             reverseSideOrder ? (
                <>
                  <div className="flex flex-col justify-center items-center">{PriceElement}</div>
                  <div className="flex flex-col justify-center items-center flex-1">{IconElement}</div>
                  <div className="flex flex-col justify-center items-center">{NameElement}</div>
                </>
             ) : (
                <>
                  <div className="flex flex-col justify-center items-center">{NameElement}</div>
                  <div className="flex flex-col justify-center items-center flex-1">{IconElement}</div>
                  <div className="flex flex-col justify-center items-center">{PriceElement}</div>
                </>
             )
           ) : (
             <>
               {NameElement}
               {IconElement}
               {PriceElement}
             </>
           )}
        </div>

      </div>

      {/* Players */}
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-[1px] md:gap-1.5 p-[1px] md:p-1 pointer-events-none z-30">
        {playersHere.map(p => (
          <motion.div 
            layoutId={`token-${p.id}`}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            key={p.id} 
            className="w-[6px] h-[6px] sm:w-[9px] sm:h-[9px] md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full border-[1px] border-white/90 shadow-[0_4px_8px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.6)]"
            style={{ backgroundColor: getPlayerColor(p.id, allPlayers) }}
            title={p.name}
          />
        ))}
      </div>
      
      {/* Owner Indicator Overlay */}
      {tile.owner && (
          <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 rounded-tl-full border-t border-l border-white/50 opacity-90 shadow-sm" style={{ backgroundColor: getPlayerColor(tile.owner, allPlayers) }} />
      )}
    </div>
  );
};

export default Tile;