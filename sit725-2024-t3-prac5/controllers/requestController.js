const Request = require('../models/requestModel');

// Fetch all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (error) {
    res.status(500).send('Error fetching requests');
  }
};