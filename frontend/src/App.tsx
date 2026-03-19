import { useSocket } from './contexts/SocketContext';
import { useState, useEffect } from 'react';
import Board from './components/Board';
import TradeModal from './components/TradeModal';
import IncomingTradeModal from './components/IncomingTradeModal';
import PropertyManager from './components/PropertyManager';

function App() {
  const { room, player, createRoom, joinRoom, startGame, rollDice, buyProperty, endTurn, socket } = useSocket();
  const [name, setName] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');

  // UI State
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [incomingTradeOffer, setIncomingTradeOffer] = useState<any>(null);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);

  useEffect(() => {
    if (!socket) return;
    socket.on('receive_trade_offer', (data: any) => {
      setIncomingTradeOffer(data);
    });
    return () => { socket.off('receive_trade_offer'); };
  }, [socket]);

  // --- Lobby UI ---
  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#006a4e] to-[#f42a41] flex flex-col items-center justify-center text-white gap-4 p-4 text-center">
        <h1 className="text-4xl font-bold mb-8">Dhoni Hobar Mojar Khela</h1>
        <input className="p-2 rounded text-black" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
        <div className="flex gap-4">
          <button className="bg-green-500 px-4 py-2 rounded font-bold hover:bg-green-600" onClick={() => createRoom(name)}>Create Room</button>
          <div className="flex gap-2">
            <input className="p-2 rounded text-black w-24" placeholder="CODE" value={roomIdInput} onChange={e => setRoomIdInput(e.target.value)} />
            <button className="bg-blue-500 px-4 py-2 rounded font-bold hover:bg-blue-600" onClick={() => joinRoom(roomIdInput, name)}>Join</button>
          </div>
        </div>
      </div>
    );
  }

  if (!room.isStarted) { 
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#006a4e] to-[#f42a41] flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-6 drop-shadow-md">
           ROOM ID: <span className="text-white">{room.id}</span>
        </h1>
        <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 shadow-2xl w-96">
          <p className="text-gray-400 font-bold mb-4 uppercase tracking-widest">Players Joined</p>
          <ul className="space-y-3">
             {room.players.map(p => (
               <li key={p.id} className="bg-slate-800 p-3 rounded-lg border border-slate-600 font-medium tracking-wide flex items-center shadow-sm">
                 <div className="w-3 h-3 rounded-full bg-green-400 mr-3 animate-pulse"></div>
                 {p.name}
               </li>
             ))}
          </ul>
          {room.players.length >= 2 && (
             <button className="mt-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 w-full rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg" onClick={startGame}>Start Game</button>
          )}
        </div>
      </div>
    );
  }

  // --- Main Game UI ---
  const currentPlayer = room.players[room.currentTurnIndex];
  const isMyTurn = player?.id === currentPlayer.id;
  const currentTile = room.board[player?.position || 0];
  const canBuy = currentTile && !currentTile.owner && (player?.money ?? 0) >= (currentTile.price ?? 0) && currentTile.price !== undefined;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#006a4e] via-[#05402f] to-[#f42a41] p-1 sm:p-2 md:p-6 lg:p-8 flex flex-col xl:flex-row gap-4 md:gap-8 justify-center items-center xl:items-start font-sans tracking-wide relative">
      
      {/* Modals */}
      {isTradeModalOpen && player && <TradeModal room={room} player={player} onClose={() => setIsTradeModalOpen(false)} socket={socket} />}
      {incomingTradeOffer && <IncomingTradeModal room={room} tradeOffer={incomingTradeOffer} onClose={() => setIncomingTradeOffer(null)} socket={socket} />}
      {selectedTileId !== null && player && <PropertyManager room={room} player={player} tile={room.board[selectedTileId]} onClose={() => setSelectedTileId(null)} socket={socket} />}

      {/* LEFT: THE BOARD */}
      <div className="w-full xl:w-2/3 2xl:w-3/4 flex justify-center items-center">
        <Board room={room} onTileClick={(id: number) => setSelectedTileId(id)} />
      </div>

      {/* RIGHT: CONTROL PANEL */}
      <div className="w-full xl:w-1/3 2xl:w-1/4 bg-[#1e293b]/95 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-2xl border border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.5)] text-white flex flex-col gap-4 md:gap-6 flex-1 max-h-none xl:h-[85vh] xl:max-h-[900px] overflow-y-auto w-full max-w-[900px] mx-auto xl:mx-0">
        
        <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-xl flex justify-between items-center shadow-inner">
          <h2 className="font-bold text-gray-300 uppercase tracking-widest text-sm">Current Turn</h2>
          <div className="text-lg font-black text-yellow-400">{currentPlayer.name}</div>
          {isMyTurn && <span className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold animate-pulse">YOURS</span>}
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {room.players.map(p => (
            <div key={p.id} className={`p-2 rounded ${p.id === currentPlayer.id ? 'border-2 border-yellow-400' : 'bg-black/20'} ${p.isBankrupt ? 'opacity-50 line-through' : ''}`}>
              <p className="font-bold">{p.name}</p>
              <p className="text-green-400">৳{p.money}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {isMyTurn && (
          <div className="bg-game-green-800 p-4 rounded flex flex-col gap-3">
            {!room.hasRolled && (
              <button onClick={rollDice} className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-bold w-full text-lg shadow-lg hover:scale-105 transition-transform">🎲 ROLL DICE</button>
            )}
            {canBuy && <button onClick={buyProperty} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold w-full shadow-lg transition-colors">🏠 BUY ৳{currentTile.price}</button>}
            {room.hasRolled && <button onClick={endTurn} className="bg-gray-100 text-black hover:bg-white px-6 py-3 rounded-lg font-bold w-full transition-colors shadow-lg">END TURN ➡️</button>}
          </div>
        )}

        {/* Game Log */}
        <div className="flex-1 min-h-[150px] bg-slate-900/80 border border-slate-700 p-3 md:p-4 rounded-xl text-xs overflow-y-auto shadow-inner flex flex-col">
          <p className="font-bold text-gray-400 uppercase tracking-widest border-b border-slate-700 pb-2 mb-2">Game Log</p>
          <div className="flex-1 flex flex-col gap-2">
             {room.logs.slice(-30).reverse().map((log, i) => <p key={i} className="text-gray-300 border-b border-slate-800 pb-1">{log}</p>)}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3">
             <button onClick={() => setIsTradeModalOpen(true)} className="text-sm bg-blue-600/80 border border-blue-500 hover:bg-blue-500 p-3 rounded-xl flex-1 font-bold uppercase tracking-wide transition-colors shadow-lg hover:scale-105">Trade</button>
             <button onClick={() => {
                if (window.confirm("Are you sure you want to declare bankruptcy? This will eliminate you from the game!")) {
                   socket?.emit('declare_bankruptcy', room.id);
                }
             }} className="text-sm bg-red-900/80 border border-red-800 hover:bg-red-700 p-3 rounded-xl flex-1 font-bold uppercase tracking-wide transition-colors">Give Up</button>
        </div>
      </div>
    </div>
  );
}

export default App;