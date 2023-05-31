const socketIO = require('socket.io');


const initSocketIO = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('con');

    socket.on('join', (roomId, playerId, isWhite) => {
      socket.join(roomId); 
      socket.playerId = playerId; 
      console.log(`${roomId} - ${playerId}`);


      socket.to(roomId).emit('playerJoined', playerId);
    });


    socket.on('move', (roomId, dataArray, legalMovesForPlayer, timers) => {
 
      console.log(roomId);
      socket.to(roomId).emit('opponentMove', dataArray, legalMovesForPlayer, timers);
    });

  
    socket.on('disconnect', () => {
      console.log('discon');
    });
  });
};

module.exports = initSocketIO;