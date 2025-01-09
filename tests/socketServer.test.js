const io = require('socket.io-client');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { app } = require('../server'); // Adjust path if needed

describe('Socket.IO Server', () => {
  let server;
  let ioServer;
  let clientSocket;
  let intervalId;

  beforeAll((done) => {
    server = createServer(app);
    ioServer = new Server(server);

    ioServer.on('connection', (socket) => {
      console.log('Server: A user connected');

      socket.on('disconnect', () => {
        console.log('Server: User disconnected');
      });

      intervalId = setInterval(() => {
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
    if (intervalId) clearInterval(intervalId); // Clear the interval
    if (clientSocket && clientSocket.connected) clientSocket.disconnect(); // Disconnect client
    ioServer.close(() => {
      server.close(done); // Close HTTP server and resolve done
    });
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
      console.log('Client: Connected to server');
      setTimeout(() => {
        console.log('Client: Disconnecting...');
        clientSocket.disconnect(); // Trigger disconnect
      }, 1000); // Delay to ensure server processes connection
    });

    clientSocket.on('disconnect', () => {
      console.log('Client: Disconnected from server');
      setTimeout(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Server: User disconnected');
        consoleSpy.mockRestore();
        done(); // Resolve the promise
      }, 500); // Delay to ensure server logs are processed
    });
  }, 120000); // Increase test timeout to 120 seconds
});