const fs = require("fs");
const path = require("path");
require("dotenv").config();

function loadConfig() {
    const configPath = path.join(process.cwd(), "config.json");

    const configData = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(configData);

    // load DB registry
    const dbPath = path.join(process.cwd(), "src/data/databases.json");

    if (fs.existsSync(dbPath)) {
        const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

        config.databases = dbData.map(db => db.url);
        config.dbRegistry = dbData; // keep metadata too
    }

    return config;
}

module.exports = loadConfig;