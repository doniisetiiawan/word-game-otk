import socketIO from 'socket.io';
import Game from './app/controllers/game';

export default (server) => {
  const io = socketIO(server, {
    transports: ['websocket'],
  });

  io.use((socket, next) => {
    const handshakeData = socket.request;
    console.log(
      'socket handshaing',
      handshakeData._query.username,
    );
    socket.user = handshakeData._query.username;

    Game.join(socket.user)
      .then((users) => {
        console.log(
          'game joined successfully',
          socket.user,
        );
        socket.broadcast.emit('join', users);
        next();
      })
      .catch((err) => {
        console.log('game joined fail', socket.user);
        next(err);
      });
  });

  io.sockets.on('connection', (socket) => {
    console.log('client connected via socket', socket.user);

    socket.on('disconnect', () => {
      console.log('socket user', socket.user, 'leave');
      Game.leave(socket.user).then((users) => {
        socket.broadcast.emit('leave', users);
      });
    });

    socket.on('chain', (word, responseFunc) => {
      console.log('socket chain', word);
      Game.chain(socket.user, word)
        .then((stat) => {
          console.log('successful to chain', stat);
          if (responseFunc) {
            responseFunc({
              status: 200,
              resp: stat,
            });
          }
          console.log(
            'broadcasting from',
            socket.user,
            stat,
          );
          socket.broadcast.emit('stat', stat);
        })
        .catch((err) => {
          console.log('fail to chain', err);
          if (responseFunc) {
            responseFunc(err);
          }
        });
    });

    socket.on('game', (query, responseFunc) => {
      console.log('socket stat', socket.user);
      Game.state().then((game) => {
        console.log('socket stat end', game);
        if (responseFunc) {
          responseFunc(game);
        }
      });
    });

    socket.on('error', (err) => {
      console.error('error', err);
    });
  });
};
