const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const initializeMongoServer = require("./config/config");
const http = require('http');
const io = require('socket.io')(http);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", taskRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
      console.log('User disconnected');
  });

  setInterval(() => {
      socket.emit('number', Math.floor(Math.random() * 10));
  }, 1000);
});

initializeMongoServer()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error("Failed to start MongoDB:", err));
