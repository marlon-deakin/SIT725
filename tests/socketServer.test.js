const io = require('socket.io-client');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { app } = require('../server'); // Adjust the path as needed

describe('Socket.IO Server', () => {
  let server;
  let ioServer;
  let clientSocket;

  beforeAll((done) => {
    server = createServer(app);
    ioServer = new Server(server);

    ioServer.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });

      setInterval(() => {
        socket.emit('number', Math.floor(Math.random() * 10));
      }, 1000);
    });

    server.listen(() => {
      const { port } = server.address();
      clientSocket = io(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });
  });

  afterAll((done) => {
    clientSocket.close();
    ioServer.close();
    server.close(done);
  });

  test('should receive a number from the server', (done) => {
    clientSocket.on('number', (num) => {
      expect(typeof num).toBe('number');
      done();
    });
  });

  test('should log user connection and disconnection', (done) => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    clientSocket.on('connect', () => {
      console.log('Client connected');
      clientSocket.close(); // Disconnect the client
    });
  
    clientSocket.on('disconnect', () => {
      expect(consoleSpy).toHaveBeenCalledWith('User disconnected');
      consoleSpy.mockRestore();
      done();
    });
  });
  
  
});
