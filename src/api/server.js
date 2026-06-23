const express = require("express");
const cors = require("cors");

const backupRoutes = require("../routes/backupRoutes");
const databaseRoutes = require("../routes/databaseRoutes");
const historyRoutes =
    require("../routes/historyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

//history
app.use("/history", historyRoutes);

// routes
app.use("/", backupRoutes);
app.use("/databases", databaseRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Database Backup API is running"
  });
});

app.get("/status", (req, res) => {
  res.json({
    status: "online",
    time: new Date().toISOString(),
    service: "database-backup-system"
  });
});

module.exports = app;