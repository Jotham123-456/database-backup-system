const express = require("express");
const router = express.Router();

const { triggerBackup } = require("../controllers/backupController");

// ✅ DO NOT CALL IT
router.post("/backup", triggerBackup);

module.exports = router;