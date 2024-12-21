const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// Sample data for requests
const sampleRequests = [
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

// Sample data for tasks
const sampleTasks = [
  {
    title: "Complete SIT725 Assignment",
    description: "Work on the project task for SIT725",
    status: "Pending",
  },
  {
    title: "Write project report",
    description: "Summarize findings and write the report",
    status: "In Progress",
  },
];

const initializeMongoServer = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", async () => {
    console.log(`MongoDB connected at ${mongoUri}`);

    try {
      const db = mongoose.connection.db;

      // Insert requests data
      const requestsCollection = db.collection("requests");
      const existingRequests = await requestsCollection.find({}).toArray();
      if (existingRequests.length === 0) {
        const result = await requestsCollection.insertMany(sampleRequests);
        console.log(`${result.insertedCount} records inserted into the 'requests' collection.`);
      } else {
        console.log("Sample data already exists in the 'requests' collection.");
      }

      // Insert tasks data
      const tasksCollection = db.collection("tasks");
      const existingTasks = await tasksCollection.find({}).toArray();
      if (existingTasks.length === 0) {
        const result = await tasksCollection.insertMany(sampleTasks);
        console.log(`${result.insertedCount} records inserted into the 'tasks' collection.`);
      } else {
        console.log("Sample data already exists in the 'tasks' collection.");
      }
    } catch (err) {
      console.error("Error inserting sample data:", err);
    }
  });

  mongoose.connection.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  return mongoServer;
};

module.exports = initializeMongoServer;
