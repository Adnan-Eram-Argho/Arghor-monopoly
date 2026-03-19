import React, { useState } from 'react';
import type { RoomState, Player } from '../types';

interface TradeModalProps {
  room: RoomState;
  player: Player;
  onClose: () => void;
  socket: any;
}

const TradeModal: React.FC<TradeModalProps> = ({ room, player, onClose, socket }) => {
  const otherPlayers = room.players.filter(p => p.id !== player.id && !p.isBankrupt);
  const [targetId, setTargetId] = useState<string>(otherPlayers[0]?.id || '');
  
  const [offerMoney, setOfferMoney] = useState(0);
  const [offerProps, setOfferProps] = useState<number[]>([]);
  
  const [reqMoney, setReqMoney] = useState(0);
  const [reqProps, setReqProps] = useState<number[]>([]);

  const targetPlayer = room.players.find(p => p.id === targetId);

  const toggleProp = (id: number, list: number[], setList: (l: number[]) => void) => {
    if (list.includes(id)) setList(list.filter(x => x !== id));
    else setList([...list, id]);
  };

  const handleSend = () => {
    socket.emit('trade_request', {
      roomId: room.id, targetId,
      offer: { money: offerMoney, propertyIds: offerProps },
      request: { money: reqMoney, propertyIds: reqProps }
    });
    onClose();
  };

  const renderProps = (p: Player, selected: number[], setSel: (l: number[]) => void) => {
    if (p.properties.length === 0) return <p className="text-slate-500 text-xs italic">No properties owned.</p>;
    return p.properties.map(pid => {
      const t = room.board[pid];
      const isSel = selected.includes(pid);
      return (
        <div key={pid} onClick={() => toggleProp(pid, selected, setSel)} 
             className={`p-2 text-xs font-bold uppercase tracking-wider cursor-pointer border rounded-lg transition-all ${isSel ? 'bg-blue-600 border-blue-400 text-white scale-105' : 'bg-slate-800 border-slate-600 text-gray-400 hover:bg-slate-700'}`}>
          {t.name}
        </div>
      )
    });
  };

  if (!targetPlayer) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-4xl flex flex-col gap-6 text-white shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 pointer-events-none"></div>
         <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-4">
             <h2 className="text-3xl md:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Trade Center</h2>
             <select value={targetId} onChange={e => setTargetId(e.target.value)} className="modern-input px-4 py-2 rounded-xl outline-none font-bold text-sm md:text-base">
                 {otherPlayers.map(p => <option key={p.id} value={p.id}>Trade with {p.name}</option>)}
             </select>
         </div>

         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* My Offer */}
            <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/10 shadow-inner">
               <h3 className="font-black text-green-400 tracking-widest uppercase mb-4 flex items-center"><span className="text-xl mr-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">↑</span> You Offer</h3>
               <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Money (৳)</label>
               <input type="number" max={player.money} min={0} value={offerMoney} onChange={e=>setOfferMoney(Number(e.target.value))} 
                      className="modern-input w-full p-4 rounded-xl mb-6 font-bold text-green-400 text-lg outline-none" />
               
               <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Properties ({offerProps.length} selected)</label>
               <div className="flex flex-wrap gap-2">{renderProps(player, offerProps, setOfferProps)}</div>
            </div>

            {/* Theirs */}
            <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/10 shadow-inner">
               <h3 className="font-black text-red-400 tracking-widest uppercase mb-4 flex items-center"><span className="text-xl mr-2 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">↓</span> You Request</h3>
               <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Money (৳)</label>
               <input type="number" max={targetPlayer.money} min={0} value={reqMoney} onChange={e=>setReqMoney(Number(e.target.value))} 
                      className="modern-input w-full p-4 rounded-xl mb-6 font-bold text-red-400 text-lg outline-none" />
               
               <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Properties ({reqProps.length} selected)</label>
               <div className="flex flex-wrap gap-2">{renderProps(targetPlayer, reqProps, setReqProps)}</div>
            </div>
         </div>

         <div className="relative z-10 flex justify-end gap-4 mt-2">
            <button onClick={onClose} className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold uppercase tracking-widest transition-colors shadow-lg">Cancel</button>
            <button onClick={handleSend} className="glow-btn-blue px-8 py-3 text-white rounded-xl font-black uppercase tracking-widest shadow-lg transition-transform">Send Proposal</button>
         </div>
      </div>
    </div>
  )
};
export default TradeModal;
