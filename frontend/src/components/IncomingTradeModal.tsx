import React from 'react';
import type { RoomState } from '../types';

interface IncomingTradeModalProps {
  room: RoomState;
  tradeOffer: any; // { senderId, senderName, offer, request }
  onClose: () => void;
  socket: any;
}

const IncomingTradeModal: React.FC<IncomingTradeModalProps> = ({ room, tradeOffer, onClose, socket }) => {
  const { senderId, senderName, offer, request } = tradeOffer;

  const handleResponse = (accepted: boolean) => {
    socket.emit('trade_response', {
      roomId: room.id,
      senderId,
      accepted,
      offer,
      request
    });
    onClose();
  };

  const renderProps = (propIds: number[]) => {
    if (propIds.length === 0) return <p className="text-slate-500 text-xs italic">No properties</p>;
    return propIds.map(pid => {
      const t = room.board[pid];
      return <div key={pid} className="p-2 text-xs font-bold uppercase tracking-wider border rounded-lg bg-slate-800 border-slate-600 text-gray-300">{t.name}</div>
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-2xl flex flex-col gap-6 text-white shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-blue-500/50 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-black pointer-events-none"></div>
         <div className="relative z-10 text-center border-b border-white/10 pb-4">
             <h2 className="text-3xl md:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Incoming Trade!</h2>
             <p className="text-slate-300 mt-2 font-medium"><strong>{senderName}</strong> wants to trade with you.</p>
         </div>

         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* They offer */}
            <div className="bg-white/5 p-6 rounded-2xl border border-green-500/30 shadow-inner">
               <h3 className="font-black text-green-400 tracking-widest uppercase mb-4 flex items-center"><span className="text-xl mr-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">↓</span> You Receive</h3>
               <div className="text-3xl font-black text-green-400 mb-6 drop-shadow-md">৳{offer.money}</div>
               <div className="flex flex-wrap gap-2">{renderProps(offer.propertyIds)}</div>
            </div>

            {/* They want */}
            <div className="bg-white/5 p-6 rounded-2xl border border-red-500/30 shadow-inner">
               <h3 className="font-black text-red-400 tracking-widest uppercase mb-4 flex items-center"><span className="text-xl mr-2 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">↑</span> You Give</h3>
               <div className="text-3xl font-black text-red-400 mb-6 drop-shadow-md">৳{request.money}</div>
               <div className="flex flex-wrap gap-2">{renderProps(request.propertyIds)}</div>
            </div>
         </div>

         <div className="relative z-10 flex justify-end gap-4 mt-4">
            <button onClick={() => handleResponse(false)} className="px-6 py-4 bg-red-900/80 hover:bg-red-800 border border-red-500/50 text-red-100 rounded-xl font-bold uppercase tracking-widest transition-colors flex-1 shadow-[0_4px_14px_rgba(220,38,38,0.4)]">Reject</button>
            <button onClick={() => handleResponse(true)} className="glow-btn-green px-6 py-4 text-white rounded-xl font-black uppercase tracking-widest shadow-lg flex-1">Accept Trade</button>
         </div>
      </div>
    </div>
  )
};
export default IncomingTradeModal;
