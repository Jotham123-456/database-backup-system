const express = require("express");
const router = express.Router();

const {
    getDatabases,
    addDatabase
} = require("../controllers/databaseController");

router.get("/", getDatabases);
router.post("/", addDatabase);

module.exports = router;