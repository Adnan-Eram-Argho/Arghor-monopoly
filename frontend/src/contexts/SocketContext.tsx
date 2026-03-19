// frontend/src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { RoomState, Player } from '../types'; // Import from types.ts

interface SocketContextProps {
  socket: Socket | null;
  room: RoomState | null;
  player: Player | null;
  createRoom: (name: string) => void;
  joinRoom: (roomId: string, name: string) => void;
  startGame: () => void;
  rollDice: () => void;
  buyProperty: () => void;
  endTurn: () => void;
}

const SocketContext = createContext<SocketContextProps | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  
  const [room, setRoom] = useState<RoomState | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const socketUrl = import.meta.env.DEV ? 'http://localhost:3000' : import.meta.env.VITE_BACKEND_URL;
    socketRef.current = io(socketUrl as string, {
      autoConnect: false
    });

    const socket = socketRef.current;
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Socket Connected:', socket.id);
    });

    socket.on('room_created', (data: RoomState) => {
      setRoom(data);
      const me = data.players.find(p => p.id === socket.id);
      if (me) setPlayer(me);
    });

    socket.on('update_room', (data: RoomState) => {
      setRoom(data);
      const me = data.players.find(p => p.id === socket.id);
      if (me) setPlayer(me);
    });

    socket.on('game_started', (data: RoomState) => {
      setRoom(data);
    });

    socket.on('game_update', (data: RoomState) => {
      setRoom(data);
      const me = data.players.find(p => p.id === socket.id);
      if (me) setPlayer(me);
    });
    
    socket.on('error_message', (msg: string) => {
      alert(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = (name: string) => {
    socketRef.current?.emit('create_room', name);
  };

  const joinRoom = (roomId: string, name: string) => {
    const cleanId = roomId.trim().toUpperCase();
    socketRef.current?.emit('join_room', { roomId: cleanId, playerName: name });
  };

  const startGame = () => {
    if (room) socketRef.current?.emit('start_game', room.id);
  };

  const rollDice = () => {
    if (room) socketRef.current?.emit('roll_dice', room.id);
  };

  const buyProperty = () => {
    if (room) socketRef.current?.emit('buy_property', room.id);
  };

  const endTurn = () => {
    if (room) socketRef.current?.emit('end_turn', room.id);
  };

  return (
    <SocketContext.Provider value={{ 
      socket: socketRef.current, 
      room, 
      player, 
      createRoom, 
      joinRoom, 
      startGame, 
      rollDice, 
      buyProperty, 
      endTurn 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext)!;