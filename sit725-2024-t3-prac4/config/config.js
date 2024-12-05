const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const initializeMongoServer = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected at ${mongoUri}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  return mongoServer;
};

module.exports = initializeMongoServer;
