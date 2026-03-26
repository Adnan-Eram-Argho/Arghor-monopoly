// backend/src/server.ts
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { RoomState, Player, Tile } from './types';
import { INITIAL_BOARD } from './data/board';
import { LUCK_DECK, PUBLIC_FUND_DECK, shuffleDeck } from './data/cards';
import { rollDice, calculateNewPosition, calculateRent, executeCard, checkBankruptcy } from './logic/game';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map<string, RoomState>();
const generateRoomCode = (): string => Math.random().toString(36).substring(2, 6).toUpperCase();

io.on("connection", (socket: Socket) => {



  // --- MORTGAGE PROPERTY ---
  socket.on('mortgage_property', (data: { roomId: string; tileId: number }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    const tile = room.board[data.tileId];

    // Validation: Owner, not already mortgaged
    const groupTiles = room.board.filter(t => t.group === tile.group);
    const hasHouses = groupTiles.some(t => t.houses && t.houses > 0);
    if (!player || !tile || tile.owner !== player.id || tile.isMortgaged || hasHouses) {
      socket.emit('error_message', 'Cannot mortgage: already mortgaged or has houses.');
      return;
    }
    
    const mortgageValue = Math.floor((tile.price || 0) / 2);
    player.money += mortgageValue;
    tile.isMortgaged = true;

    room.logs.push(`${player.name} mortgaged ${tile.name} for $${mortgageValue}`);
    io.to(data.roomId).emit('game_update', room);
  });

  // --- UNMORTGAGE PROPERTY ---
  socket.on('unmortgage_property', (data: { roomId: string; tileId: number }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const tile = room.board[data.tileId];

    if (!player || !tile || tile.owner !== player.id || !tile.isMortgaged) return;

    const unmortgageValue = Math.floor((tile.price || 0) / 2) + Math.floor((tile.price || 0) * 0.05); // + 10% interest on mortgage
    if (player.money >= unmortgageValue) {
       player.money -= unmortgageValue;
       tile.isMortgaged = false;
       room.logs.push(`${player.name} unmortgaged ${tile.name} for $${unmortgageValue}`);
       io.to(data.roomId).emit('game_update', room);
    } else {
       socket.emit('error_message', 'Not enough money to unmortgage.');
    }
  });

  // --- BUILD HOUSE ---
  socket.on('build_house', (data: { roomId: string; tileId: number }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const tile = room.board[data.tileId];
    if (!player || !tile || tile.owner !== player.id || tile.type !== 'PROPERTY' || !tile.houseCost) return;

    const groupTiles = room.board.filter(t => t.group === tile.group);
    const ownsAll = groupTiles.every(t => t.owner === player.id && !t.isMortgaged);
    if (!ownsAll) return socket.emit('error_message', 'Must own full color group (unmortgaged) to build.');

    const currentHouses = tile.houses || 0;
    if (currentHouses >= 5) return socket.emit('error_message', 'Max houses reached (Hotel).');
    const minHousesInGroup = Math.min(...groupTiles.map(t => t.houses || 0));
    if (currentHouses > minHousesInGroup) return socket.emit('error_message', 'Must build evenly across the group.');

    if (player.money >= tile.houseCost) {
      player.money -= tile.houseCost;
      tile.houses = currentHouses + 1;
      room.logs.push(`${player.name} built a ${tile.houses === 5 ? 'Hotel' : 'House'} on ${tile.name} for $${tile.houseCost}`);
      io.to(data.roomId).emit('game_update', room);
    } else {
      socket.emit('error_message', 'Not enough money!');
    }
  });

  // --- SELL HOUSE ---
  socket.on('sell_house', (data: { roomId: string; tileId: number }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const tile = room.board[data.tileId];
    if (!player || !tile || tile.owner !== player.id || tile.type !== 'PROPERTY' || !tile.houseCost) return;

    const currentHouses = tile.houses || 0;
    if (currentHouses === 0) return socket.emit('error_message', 'No houses to sell.');

    const groupTiles = room.board.filter(t => t.group === tile.group);
    const maxHousesInGroup = Math.max(...groupTiles.map(t => t.houses || 0));
    if (currentHouses < maxHousesInGroup) return socket.emit('error_message', 'Must sell evenly across the color group.');

    const sellValue = Math.floor(tile.houseCost / 2);
    player.money += sellValue;
    tile.houses = currentHouses - 1;
    room.logs.push(`${player.name} sold a house on ${tile.name} for $${sellValue}`);
    io.to(data.roomId).emit('game_update', room);
  });

  // --- TRADE REQUEST ---
  // Payload: { roomId, targetId, offer: { money, propertyIds }, request: { money, propertyIds } }
  socket.on('trade_request', (data: any) => {
    const room = rooms.get(data.roomId);
    if (!room) return;

    const sender = room.players.find(p => p.id === socket.id);
    const receiver = room.players.find(p => p.id === data.targetId);

    if (!sender || !receiver) return;

    // Store trade pending state (simplified: just emit to receiver)
    // In a full app, you'd store this in RoomState to handle disconnects
    socket.to(data.targetId).emit('receive_trade_offer', {
      senderId: sender.id,
      senderName: sender.name,
      offer: data.offer,
      request: data.request
    });
  });

  // --- TRADE RESPONSE ---
  socket.on('trade_response', (data: { roomId: string; senderId: string; accepted: boolean; offer: any; request: any }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;

    const receiver = room.players.find(p => p.id === socket.id);
    const sender = room.players.find(p => p.id === data.senderId);

    if (!receiver || !sender) return;

    if (data.accepted) {
      // Execute Trade
      
      // 1. Transfer Money
      sender.money += (data.offer.money || 0);
      sender.money -= (data.request.money || 0);
      receiver.money += (data.request.money || 0);
      receiver.money -= (data.offer.money || 0);

      // 2. Transfer Properties
      const transferProperty = (from: Player, to: Player, tileId: number) => {
        const tile = room.board[tileId];
        if (tile && tile.owner === from.id) {
          tile.owner = to.id;
          from.properties = from.properties.filter(id => id !== tileId);
          to.properties.push(tileId);
        }
      };

      data.offer.propertyIds.forEach((id: number) => transferProperty(sender, receiver, id));
      data.request.propertyIds.forEach((id: number) => transferProperty(receiver, sender, id));

      room.logs.push(`Trade completed between ${sender.name} and ${receiver.name}!`);
      io.to(data.roomId).emit('game_update', room);
    } else {
      room.logs.push(`${receiver.name} rejected the trade.`);
      socket.to(data.senderId).emit('error_message', 'Trade rejected.');
    }
  });

  // --- DECLARE BANKRUPTCY ---
  socket.on('declare_bankruptcy', (roomId: string) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    player.isBankrupt = true;
    
    // Return properties to bank (unowned)
    player.properties.forEach(tileId => {
      const tile = room.board[tileId];
      if (tile) {
        tile.owner = null;
        tile.isMortgaged = false;
        tile.houses = 0;
      }
    });
    player.properties = [];
    player.money = 0;

    room.logs.push(`☠️ ${player.name} declared BANKRUPTCY and left the game.`);

    // Check if game over (only one player left with money)
    const activePlayers = room.players.filter(p => !p.isBankrupt);
    if (activePlayers.length === 1) {
      room.logs.push(`🏆 ${activePlayers[0].name} WINS THE GAME!`);
      room.isStarted = false; // End game
    } else {
      // Force end turn if it was their turn
      if (room.players[room.currentTurnIndex].id === player.id) {
         // Find next non-bankrupt player
         let nextIndex = (room.currentTurnIndex + 1) % room.players.length;
         while (room.players[nextIndex].isBankrupt) {
           nextIndex = (nextIndex + 1) % room.players.length;
         }
         room.currentTurnIndex = nextIndex;
         room.hasRolled = false;
      }
    }

    io.to(roomId).emit('game_update', room);
  });

  console.log(`⚡ User connected: ${socket.id}`);

  // --- LOBBY LOGIC (Same as before) ---
  socket.on('create_room', (playerName: string) => {
    const roomId = generateRoomCode();
    const hostPlayer: Player = {
      id: socket.id, name: playerName, position: 0, money: 20000,
      properties: [], inJail: false, jailTurns: 0, consecutiveDoubles: 0, isBankrupt: false, getOutOfJailCards: 0
    };
    const newRoom: RoomState = {
      id: roomId, players: [hostPlayer], board: JSON.parse(JSON.stringify(INITIAL_BOARD)),
      currentTurnIndex: 0, hasRolled: false, isStarted: false,
      availableCardsVaggo: shuffleDeck(LUCK_DECK),
      availableCardsSujog: shuffleDeck(PUBLIC_FUND_DECK),
      logs: [`${playerName} created the room.`]
    };
    rooms.set(roomId, newRoom);
    socket.join(roomId);
    socket.emit('room_created', newRoom);
  });

  socket.on('join_room', (data: { roomId: string; playerName: string }) => {
    const room = rooms.get(data.roomId.toUpperCase());
    if (!room) return socket.emit('error_message', 'Room not found!');
    if (room.isStarted) return socket.emit('error_message', 'Game already in progress.');
    if (room.players.length >= 4) return socket.emit('error_message', 'Room is full.');

    const newPlayer: Player = {
      id: socket.id, name: data.playerName, position: 0, money: 20000,
      properties: [], inJail: false, jailTurns: 0, consecutiveDoubles: 0, isBankrupt: false, getOutOfJailCards: 0
    };
    room.players.push(newPlayer);
    room.logs.push(`${data.playerName} joined the game.`);
    socket.join(data.roomId);
    io.to(data.roomId).emit('update_room', room);
  });

  // --- START GAME ---
  socket.on('start_game', (roomId: string) => {
    const room = rooms.get(roomId);
    if (!room || room.players.length < 2) return; // Need at least 2 players
    room.isStarted = true;
    room.logs.push('Game Started!');
    io.to(roomId).emit('game_started', room);
  });

  // --- ROLL DICE & MOVE ---
  socket.on('roll_dice', (roomId: string) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const playerIndex = room.players.findIndex(p => p.id === socket.id);
    // Security: Must be player's turn
    if (playerIndex !== room.currentTurnIndex) return;
    if (room.hasRolled) {
      socket.emit('error_message', 'You have already rolled this turn!');
      return;
    }

    const player = room.players[playerIndex];
    if (player.money < 0) {
      socket.emit('error_message', 'You have a negative balance! You must settle your debts or declare bankruptcy before rolling.');
      return;
    }
    const [d1, d2] = rollDice();
    const isDouble = d1 === d2;
    const steps = d1 + d2;

    if (player.inJail) {
       player.jailTurns += 1;
       if (isDouble) {
         player.inJail = false;
         player.jailTurns = 0;
         room.logs.push(`${player.name} rolled a double and escaped Jail!`);
       } else if (player.jailTurns >= 3) {
         if (player.money >= 500) {
           player.money -= 500;
           player.inJail = false;
           player.jailTurns = 0;
           room.logs.push(`${player.name} paid 500 BDT to get out of Karagar after 3 turns.`);
         } else {
           socket.emit('error_message', 'You cannot afford to leave Karagar (500 BDT). You must sell/trade or declare bankruptcy.');
           return;
         }
       } else {
         room.logs.push(`${player.name} is in jail and rolled ${d1}+${d2}.`);
         room.hasRolled = true; // Turn ends
         io.to(roomId).emit('game_update', room);
         return;
       }
    } else {
       if (isDouble) {
         player.consecutiveDoubles += 1;
         if (player.consecutiveDoubles === 3) {
           room.logs.push(`${player.name} rolled 3 doubles! Go To Jail.`);
           player.position = 10;
           player.inJail = true;
           player.consecutiveDoubles = 0;
           room.hasRolled = true; // Turn ends
           io.to(roomId).emit('game_update', room);
           return;
         }
         room.logs.push(`${player.name} rolled a double: ${d1} + ${d2} = ${steps}! They get another turn.`);
       } else {
         player.consecutiveDoubles = 0;
         room.hasRolled = true; // No more rolling
         room.logs.push(`${player.name} rolled ${d1} + ${d2} = ${steps}`);
       }
    }

    // Move Player
    const { position, passedGo } = calculateNewPosition(player.position, steps);
    player.position = position;
    if (passedGo) {
      player.money += 2000;
      room.logs.push(`${player.name} passed START and collected 2000 BDT!`);
    }

    // Handle Tile Landing
    handleTileLanding(room, player, steps);

    // Notify Clients
    io.to(roomId).emit('game_update', room);
  });

  // --- BUY PROPERTY ---
  socket.on('buy_property', (roomId: string) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const tile = room.board[player?.position || 0];

    if (!player || !tile || tile.owner) return; // Already owned or invalid

    if (player.money >= (tile.price || 0)) {
      player.money -= tile.price || 0;
      tile.owner = player.id;
      player.properties.push(tile.id);
      room.logs.push(`${player.name} bought ${tile.name} for ৳${tile.price}`);
      io.to(roomId).emit('game_update', room);
    } else {
      socket.emit('error_message', 'Not enough money!');
    }
  });

  // --- PROPERTY MANAGEMENT ---
  socket.on('build_house', (data: { roomId: string; tileId: number }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const tile = room.board[data.tileId];
    if (!player || !tile || tile.owner !== player.id || tile.isMortgaged || tile.type !== 'PROPERTY') return;

    // Must own all properties in group
    const groupTiles = room.board.filter(t => t.group === tile.group);
    const ownsAll = groupTiles.every(t => t.owner === player.id && !t.isMortgaged);
    if (!ownsAll) return socket.emit('error_message', 'You must own all unmortgaged properties in this group.');

    if ((tile.houses || 0) < 5 && player.money >= (tile.houseCost || 0)) {
      player.money -= (tile.houseCost || 0);
      tile.houses = (tile.houses || 0) + 1;
      room.logs.push(`${player.name} built a ${tile.houses === 5 ? 'Hotel' : 'House'} on ${tile.name} for ৳${tile.houseCost}.`);
      io.to(data.roomId).emit('game_update', room);
    }
  });

  socket.on('sell_house', (data: { roomId: string; tileId: number }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const tile = room.board[data.tileId];
    if (!player || !tile || tile.owner !== player.id || tile.isMortgaged || tile.type !== 'PROPERTY') return;

    if ((tile.houses || 0) > 0) {
      const sellValue = Math.floor((tile.houseCost || 0) / 2);
      player.money += sellValue;
      tile.houses = (tile.houses || 0) - 1;
      room.logs.push(`${player.name} sold a building on ${tile.name} for ৳${sellValue}.`);
      io.to(data.roomId).emit('game_update', room);
    }
  });

  socket.on('mortgage_property', (data: { roomId: string; tileId: number }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const tile = room.board[data.tileId];
    if (!player || !tile || tile.owner !== player.id || tile.isMortgaged) return;

    // Check if any property in group has houses
    const groupTiles = room.board.filter(t => t.group === tile.group);
    const hasHouses = groupTiles.some(t => t.houses && t.houses > 0);
    if (hasHouses) return socket.emit('error_message', 'You must sell all houses in this group first.');

    const mortgageValue = Math.floor((tile.price || 0) / 2);
    player.money += mortgageValue;
    tile.isMortgaged = true;
    room.logs.push(`${player.name} mortgaged ${tile.name} for ৳${mortgageValue}.`);
    io.to(data.roomId).emit('game_update', room);
  });

  socket.on('unmortgage_property', (data: { roomId: string; tileId: number }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const tile = room.board[data.tileId];
    if (!player || !tile || tile.owner !== player.id || !tile.isMortgaged) return;

    const unmortgageCost = Math.floor((tile.price || 0) / 2) + Math.floor((tile.price || 0) * 0.05);
    if (player.money >= unmortgageCost) {
      player.money -= unmortgageCost;
      tile.isMortgaged = false;
      room.logs.push(`${player.name} unmortgaged ${tile.name} for ৳${unmortgageCost}.`);
      io.to(data.roomId).emit('game_update', room);
    } else {
      socket.emit('error_message', 'Not enough money to unmortgage!');
    }
  });

  // --- END TURN ---
  socket.on('end_turn', (roomId: string) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const playerIndex = room.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== room.currentTurnIndex) return;
    
    if (!room.hasRolled) {
      socket.emit('error_message', 'You must roll the dice first!');
      return;
    }

    const player = room.players[playerIndex];
    if (player.money < 0) {
      socket.emit('error_message', 'You have a negative balance! Mortgage properties, trade, or declare bankruptcy to end your turn.');
      return;
    }

    // Move to next player (skip bankrupt players)
    let nextIndex = (room.currentTurnIndex + 1) % room.players.length;
    while (room.players[nextIndex].isBankrupt) {
      nextIndex = (nextIndex + 1) % room.players.length;
    }
    
    room.currentTurnIndex = nextIndex;
    room.hasRolled = false;
    room.logs.push(`It is now ${room.players[nextIndex].name}'s turn.`);
    io.to(roomId).emit('game_update', room);
  });

  // --- HELPER: HANDLE TILE LOGIC ---
  function handleTileLanding(room: RoomState, player: Player, steps: number) {
    const tile = room.board[player.position];
    let log = "";

    switch (tile.type) {
      case 'PROPERTY':
      case 'STATION':
      case 'UTILITY':
        if (tile.owner && tile.owner !== player.id) {
          // Pay Rent
          const owner = room.players.find(p => p.id === tile.owner);
          if (owner && !tile.isMortgaged) {
            const rentAmount = calculateRent(tile, room.board, steps); 
            
            player.money -= rentAmount;
            owner.money += rentAmount;
            log = `${player.name} paid $${rentAmount} rent to ${owner.name}`;
          }
        } else if (!tile.owner) {
          log = `${player.name} landed on ${tile.name}. Available for purchase.`;
        }
        break;

      case 'TAX':
        const taxAmount = tile.id === 4 ? 2000 : 1000; // Income Tax 2000, VAT 1000
        player.money -= taxAmount;
        log = `${player.name} paid ${taxAmount} BDT in taxes.`;
        break;

      case 'LUCK':
        const cardV = room.availableCardsVaggo.pop()!;
        const resultV = executeCard(player, cardV);
        log = resultV.log;
        if (room.availableCardsVaggo.length === 0) room.availableCardsVaggo = shuffleDeck(LUCK_DECK);
        break;

      case 'PUBLIC_FUND':
        const cardS = room.availableCardsSujog.pop()!;
        const resultS = executeCard(player, cardS);
        log = resultS.log;
        if (room.availableCardsSujog.length === 0) room.availableCardsSujog = shuffleDeck(PUBLIC_FUND_DECK);
        break;

      case 'CORNER':
        if (tile.id === 30) { // Go To Jail
          player.position = 10;
          player.inJail = true;
          log = `${player.name} was sent to Jail!`;
        }
        break;
    }

    if (log) room.logs.push(log);
    
    // Check Bankruptcy
    if (checkBankruptcy(player)) {
      room.logs.push(`⚠️ ${player.name} is BANKRUPT!`);
      // We will handle full bankruptcy logic in Phase 4
    }
  }
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`🎮 Game Server running on http://localhost:${PORT}`);
});