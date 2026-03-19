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
      <div className="min-h-screen bg-mesh-gradient flex flex-col items-center justify-center text-white p-4 text-center font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        <div className="glass-panel p-8 md:p-12 rounded-3xl z-10 w-full max-w-md flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-tight">
            Dhoni Hobar<br/>Mojar Khela
          </h1>
          <p className="text-slate-300 font-medium text-sm md:text-base uppercase tracking-widest">Bangladesh Monopoly</p>
          
          <div className="flex flex-col gap-4 mt-4 text-left">
            <input 
              className="modern-input px-4 py-3 rounded-xl text-center font-medium text-lg w-full" 
              placeholder="Enter Your Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
            
            <button 
              className="glow-btn-green px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-white w-full" 
              onClick={() => createRoom(name)}
            >
              Create New Room
            </button>
            
            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-sm text-white/50 font-medium">OR</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="flex gap-2 w-full">
              <input 
                className="modern-input px-4 py-3 rounded-xl text-center font-medium text-base w-1/2" 
                placeholder="ROOM CODE" 
                value={roomIdInput} 
                onChange={e => setRoomIdInput(e.target.value)} 
              />
              <button 
                className="glow-btn-blue px-6 py-3 rounded-xl font-bold uppercase tracking-wider w-1/2 text-white" 
                onClick={() => joinRoom(roomIdInput, name)}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room.isStarted) { 
    return (
      <div className="min-h-screen bg-mesh-gradient flex flex-col items-center justify-center text-white p-4 text-center font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        <div className="glass-panel p-8 md:p-10 rounded-3xl z-10 w-full max-w-md flex flex-col items-center shadow-2xl">
          <div className="bg-black/40 px-6 py-3 rounded-full border border-white/10 mb-8 inline-block shadow-inner">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center justify-center gap-3">
              Room Code <span className="text-yellow-400 font-mono text-3xl font-black">{room.id}</span>
            </h2>
          </div>
          
          <div className="w-full">
            <p className="text-white/60 font-bold mb-4 uppercase tracking-widest text-sm text-center">Players in Lobby ({room.players.length}/4)</p>
            <ul className="space-y-3 w-full">
               {room.players.map(p => (
                 <li key={p.id} className="glass-panel bg-white/5 p-4 rounded-xl border border-white/10 font-bold tracking-wide flex items-center text-lg shadow-lg transform transition-all hover:scale-[1.02]">
                   <div className="w-4 h-4 rounded-full bg-green-400 mr-4 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse"></div>
                   {p.name}
                   {p.id === room.players[0].id && <span className="ml-auto text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 px-2 py-1 rounded-md uppercase tracking-wider">Host</span>}
                 </li>
               ))}
            </ul>
          </div>
          
          <div className="mt-10 w-full">
            {room.players.length >= 2 ? (
               <button 
                 className="glow-btn-green text-white px-6 py-4 w-full rounded-2xl font-black text-xl uppercase tracking-widest shadow-lg" 
                 onClick={startGame}
               >
                 START GAME
               </button>
            ) : (
               <p className="text-yellow-500/80 font-medium italic animate-pulse">Waiting for more players to join...</p>
            )}
          </div>
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
    <div className="min-h-[100dvh] bg-mesh-gradient p-1 sm:p-2 md:p-6 lg:p-8 flex flex-col xl:flex-row gap-4 md:gap-8 justify-center items-center xl:items-start tracking-wide relative">
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      {/* Modals */}
      <div className="z-50">
        {isTradeModalOpen && player && <TradeModal room={room} player={player} onClose={() => setIsTradeModalOpen(false)} socket={socket} />}
        {incomingTradeOffer && <IncomingTradeModal room={room} tradeOffer={incomingTradeOffer} onClose={() => setIncomingTradeOffer(null)} socket={socket} />}
        {selectedTileId !== null && player && <PropertyManager room={room} player={player} tile={room.board[selectedTileId]} onClose={() => setSelectedTileId(null)} socket={socket} />}
      </div>

      {/* LEFT: THE BOARD */}
      <div className="w-full xl:w-2/3 2xl:w-3/4 flex justify-center items-center">
        <Board room={room} onTileClick={(id: number) => setSelectedTileId(id)} />
      </div>

      {/* RIGHT: CONTROL PANEL */}
      <div className="w-full xl:w-1/3 2xl:w-1/4 glass-panel p-4 sm:p-5 md:p-6 rounded-3xl text-white flex flex-col gap-5 flex-1 max-h-none xl:h-[85vh] xl:max-h-[900px] overflow-y-auto max-w-[900px] mx-auto xl:mx-0 z-10 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
        
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent pointer-events-none"></div>
          <div>
             <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-1">Current Turn</h2>
             <div className="text-2xl font-black text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{currentPlayer.name}</div>
          </div>
          {isMyTurn && <span className="text-xs bg-red-600 border border-red-500 text-white px-3 py-1.5 rounded-lg font-bold animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]">YOUR TURN</span>}
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {room.players.map(p => (
            <div key={p.id} className={`p-4 rounded-2xl transition-all duration-300 ${p.id === currentPlayer.id ? 'bg-white/10 border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-black/20 border border-transparent'} ${p.isBankrupt ? 'opacity-40 grayscale' : ''}`}>
              <p className="font-bold text-base mb-1 truncate">{p.name}</p>
              <p className="text-green-400 font-mono text-lg font-bold">৳{p.money}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {isMyTurn && (
          <div className="bg-black/30 border border-white/5 p-5 rounded-2xl flex flex-col gap-4 shadow-inner">
            {!room.hasRolled && (
              <button onClick={rollDice} className="glow-btn-blue text-white px-6 py-4 rounded-xl font-bold w-full text-xl shadow-lg uppercase tracking-wider flex items-center justify-center gap-3">
                <span className="text-2xl">🎲</span> ROLL DICE
              </button>
            )}
            {canBuy && (
              <button onClick={buyProperty} className="glow-btn-green text-white px-6 py-4 rounded-xl font-bold w-full uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg">
                <span className="text-xl">🏠</span> BUY ৳{currentTile.price}
              </button>
            )}
            {room.hasRolled && (
              <button onClick={endTurn} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-4 rounded-xl font-bold w-full transition-all shadow-lg uppercase tracking-wider flex items-center justify-center gap-2">
                END TURN ➡️
              </button>
            )}
          </div>
        )}

        {/* Game Log */}
        <div className="flex-1 min-h-[180px] bg-black/40 border border-white/5 p-4 md:p-5 rounded-2xl text-sm overflow-y-auto shadow-inner flex flex-col">
          <p className="font-black text-white/50 uppercase tracking-widest border-b border-white/10 pb-3 mb-3 text-xs flex items-center gap-2">
            <span>📜</span> ACTION LOG
          </p>
          <div className="flex-1 flex flex-col gap-2.5">
             {room.logs.slice(-30).reverse().map((log, i) => (
                <p key={i} className="text-slate-300 border-b border-white/5 pb-2 leading-relaxed">
                   <span className="text-yellow-500/80 mr-2 text-xs">▶</span>
                   {log}
                </p>
             ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-4">
             <button onClick={() => setIsTradeModalOpen(true)} className="flex-1 text-sm bg-blue-600/50 hover:bg-blue-600 border border-blue-500/50 hover:border-blue-400 p-4 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2">
                <span>🤝</span> Trade
             </button>
             <button onClick={() => {
                if (window.confirm("Are you sure you want to declare bankruptcy? This will eliminate you from the game!")) {
                   socket?.emit('declare_bankruptcy', room.id);
                }
             }} className="flex-1 text-sm bg-red-900/50 hover:bg-red-800 border border-red-800/50 hover:border-red-500 p-4 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg text-red-100 flex items-center justify-center gap-2">
                <span>☠️</span> Give Up
             </button>
        </div>
      </div>
    </div>
  );
}

export default App;