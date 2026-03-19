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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-600 p-6 rounded-2xl w-full max-w-4xl flex flex-col gap-6 text-white shadow-2xl">
         
         <div className="flex justify-between items-center border-b border-slate-700 pb-4">
             <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase">Trade Center</h2>
             <select value={targetId} onChange={e => setTargetId(e.target.value)} className="bg-slate-800 border border-slate-600 text-white p-2 rounded-lg outline-none font-bold">
                 {otherPlayers.map(p => <option key={p.id} value={p.id}>Trade with {p.name}</option>)}
             </select>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* My Offer */}
            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
               <h3 className="font-black text-green-400 tracking-widest uppercase mb-4 flex items-center"><span className="text-xl mr-2">↑</span> You Offer</h3>
               <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Money (৳)</label>
               <input type="number" max={player.money} min={0} value={offerMoney} onChange={e=>setOfferMoney(Number(e.target.value))} 
                      className="w-full bg-slate-800 border border-slate-600 p-3 rounded-lg mb-6 font-bold text-green-300 outline-none focus:border-green-500" />
               
               <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Properties ({offerProps.length} selected)</label>
               <div className="flex flex-wrap gap-2">{renderProps(player, offerProps, setOfferProps)}</div>
            </div>

            {/* Theirs */}
            <div className="bg-slate-900/50 p-4 md:p-5 rounded-xl border border-slate-700/50">
               <h3 className="font-black text-red-400 tracking-widest uppercase mb-4 flex items-center"><span className="text-xl mr-2">↓</span> You Request</h3>
               <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Money (৳)</label>
               <input type="number" max={targetPlayer.money} min={0} value={reqMoney} onChange={e=>setReqMoney(Number(e.target.value))} 
                      className="w-full bg-slate-800 border border-slate-600 p-3 rounded-lg mb-6 font-bold text-red-300 outline-none focus:border-red-500" />
               
               <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Properties ({reqProps.length} selected)</label>
               <div className="flex flex-wrap gap-2">{renderProps(targetPlayer, reqProps, setReqProps)}</div>
            </div>
         </div>

         <div className="flex justify-end gap-4 mt-2">
            <button onClick={onClose} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold uppercase tracking-widest transition-colors">Cancel</button>
            <button onClick={handleSend} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">Send Proposal</button>
         </div>
      </div>
    </div>
  )
};
export default TradeModal;
