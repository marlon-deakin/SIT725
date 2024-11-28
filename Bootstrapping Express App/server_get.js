const express = require("express");
const path = require("path");
const app = express();

// Serve Materialize CSS/JS from node_modules
app.use('/materialize', express.static(path.join(__dirname, 'node_modules', 'materialize-css', 'dist')));

// Serve your custom static files (styles.css) from the public folder
app.use(express.static(path.join(__dirname, 'public')));  // Make sure 'public' is correctly referenced here

// Define the route for the index page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Set the port number and start the server
const port = 3040;
app.listen(port, () => {
    console.log("Server is running on port " + port);
});