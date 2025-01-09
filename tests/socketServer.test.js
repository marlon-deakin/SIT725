const io = require("socket.io-client");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { app } = require("../server"); // Adjust the path if necessary

describe("Socket.IO Server", () => {
  let server;
  let ioServer;
  let clientSocket;
  let intervalId;

  beforeAll((done) => {
    console.log("Test: Starting server");
    server = createServer(app);
    ioServer = new Server(server);

    ioServer.on("connection", (socket) => {
      console.log("Server: A user connected");

      // Emit random numbers at an interval
      intervalId = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 10);
        socket.emit("number", randomNum);
      }, 500);

      socket.on("disconnect", () => {
        console.log("Server: User disconnected");
        clearInterval(intervalId); // Cleanup interval on disconnect
      });
    });

    server.listen(() => {
      const { port } = server.address();
      clientSocket = io(`http://localhost:${port}`);
      clientSocket.on("connect", () => {
        console.log("Test: Client connected");
        done();
      });
    });
  });

  afterAll((done) => {
    console.log("Test: Cleaning up resources");
    if (clientSocket.connected) {
      clientSocket.disconnect();
      console.log("Test: Client socket disconnected");
    }
    ioServer.close(() => {
      console.log("Test: IO server closed");
      server.close(() => {
        console.log("Test: HTTP server closed");
        done();
      });
    });
  });

  test("should receive a number from the server", (done) => {
    clientSocket.on("number", (num) => {
      console.log(`Test: Received number ${num}`);
      try {
        expect(typeof num).toBe("number");
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
