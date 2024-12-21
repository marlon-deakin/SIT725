const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const initializeMongoServer = require("./config/config");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", taskRoutes);

initializeMongoServer()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error("Failed to start MongoDB:", err));
