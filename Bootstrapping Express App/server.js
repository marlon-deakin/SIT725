// var express = require("express")
// var app = express()
// var port = process.env.port || 3000;
// app.listen(port,()=>{
// console.log("App listening to: "+port)
// })

const express = require('express');
const app = express();
const path = require('path');

// Serve static files from node_modules
app.use('/materialize', express.static(path.join(__dirname, 'node_modules', 'materialize-css', 'dist')));

// Your other routes and middleware
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the HTML file (adjust path as needed)
});

// Define your port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


