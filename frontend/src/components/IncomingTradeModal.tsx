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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-blue-500 p-6 rounded-2xl w-full max-w-2xl flex flex-col gap-6 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]">
         
         <div className="text-center border-b border-slate-700 pb-4">
             <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase">Incoming Trade!</h2>
             <p className="text-slate-400 mt-2"><strong>{senderName}</strong> wants to trade with you.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* They offer */}
            <div className="bg-slate-900/50 p-5 rounded-xl border border-green-700/50">
               <h3 className="font-black text-green-400 tracking-widest uppercase mb-4 flex items-center"><span className="text-xl mr-2">↓</span> You Receive</h3>
               <div className="text-2xl font-black text-green-300 mb-4">৳{offer.money}</div>
               <div className="flex flex-wrap gap-2">{renderProps(offer.propertyIds)}</div>
            </div>

            {/* They want */}
            <div className="bg-slate-900/50 p-5 rounded-xl border border-red-700/50">
               <h3 className="font-black text-red-400 tracking-widest uppercase mb-4 flex items-center"><span className="text-xl mr-2">↑</span> You Give</h3>
               <div className="text-2xl font-black text-red-300 mb-4">৳{request.money}</div>
               <div className="flex flex-wrap gap-2">{renderProps(request.propertyIds)}</div>
            </div>
         </div>

         <div className="flex justify-end gap-4 mt-2">
            <button onClick={() => handleResponse(false)} className="px-6 py-3 bg-red-900/80 hover:bg-red-800 text-red-100 rounded-xl font-bold uppercase tracking-widest transition-colors flex-1 shadow-[0_4px_14px_0_rgba(220,38,38,0.39)]">Reject</button>
            <button onClick={() => handleResponse(true)} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black uppercase tracking-widest shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:scale-105 transition-transform flex-1">Accept</button>
         </div>
      </div>
    </div>
  )
};
export default IncomingTradeModal;
