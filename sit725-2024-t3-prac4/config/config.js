const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Sample data to insert
const sampleData = [
  {
    id: 1,
    title: "Babysitting Request",
    description: "Looking for a babysitter for Saturday evening",
    date: "2024-12-14",
  },
  {
    id: 2,
    title: "Pet Sitting Request",
    description: "Need someone to take care of my dog",
    date: "2024-12-15",
  },
];

const initializeMongoServer = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('connected', async () => {
    console.log(`MongoDB connected at ${mongoUri}`);

    try {
      const db = mongoose.connection.db; // Access the MongoDB instance
      const collection = db.collection('requests'); // Create or get the collection

      // Insert sample data if the collection is empty
      const existingData = await collection.find({}).toArray();
      if (existingData.length === 0) {
        const result = await collection.insertMany(sampleData);
        console.log(`${result.insertedCount} records inserted into the 'requests' collection.`);
      } else {
        console.log("Sample data already exists in the 'requests' collection.");
      }
    } catch (err) {
      console.error("Error inserting sample data:", err);
    }
  });

  mongoose.connection.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  return mongoServer;
};

module.exports = initializeMongoServer;
