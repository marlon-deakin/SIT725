const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const initializeMongoServer = require('./config/config');

const app = express();
const PORT = 3000;

app.use(express.json());

// Sample endpoint for testing
app.get('/api/requests', async (req, res) => {
  try {
    const db = mongoose.connection.db; // Access the MongoDB instance
    const requests = await db.collection('requests').find({}).toArray();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).send('Error fetching requests');
  }
});

const startServer = async () => {
  try {
    await initializeMongoServer(); // Ensure MongoDB server is initialized
    console.log('MongoDB Memory Server Initialized');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error initializing MongoDB:', err);
    process.exit(1);
  }
};

startServer(); // Start the server
