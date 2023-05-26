const socketIO = require('socket.io');

// Initialize Socket.IO server
const initSocketIO = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('con');
    // Event when a player joins the room
    socket.on('join', (roomId, playerId, isWhite) => {
      socket.join(roomId); // Join the specified room
      socket.playerId = playerId; // Store the player ID in the socket
      console.log(`${roomId} - ${playerId}`);
      // Notify other players in the room that a new player has joined
      socket.to(roomId).emit('playerJoined', playerId);
    });

    // Event when a player makes a move
    socket.on('move', (roomId, dataArray, legalMovesForPlayer) => {
      // Emit the move event to other players in the room
      //console.log(fen);
      socket.to(roomId).emit('opponentMove', dataArray, legalMovesForPlayer);
    });

    // Event when a player disconnects
    socket.on('disconnect', () => {
      console.log('discon');
    });
  });
};

module.exports = initSocketIO;