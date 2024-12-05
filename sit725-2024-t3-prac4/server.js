const express = require('express');
const initializeMongoServer = require('./config/config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Initialize MongoDB Memory Server
initializeMongoServer().then(() => {
  console.log('MongoDB Memory Server Initialized');
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management App!');
});

const taskRoutes = require('./routes/taskRoutes');
app.use('/api', taskRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
