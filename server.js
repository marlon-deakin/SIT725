const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const initializeMongoServer = require("./config/config");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.json());
app.use("/api", taskRoutes);

io.on('connection', (socket) => {
  console.log('Server: A user connected');

  // Define the interval for emitting random numbers
  const intervalId = setInterval(() => {
    socket.emit('number', Math.floor(Math.random() * 10));
  }, 1000);

  // Cleanup logic when the client disconnects
  socket.on('disconnect', () => {
    console.log('Server: User disconnected');
    clearInterval(intervalId); // Ensure the interval is cleared
  });
});


initializeMongoServer()
  .then(() => {
    server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
    app.use(express.static('public'));
  })
  .catch((err) => console.error("Failed to start MongoDB:", err));

module.exports = { app, server, io };