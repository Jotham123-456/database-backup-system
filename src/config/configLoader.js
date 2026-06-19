const fs = require("fs");
const path = require("path");
require("dotenv").config();

function loadConfig() {
    const configPath = path.join(process.cwd(), "config.json");

    const configData = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(configData);

    // Inject MongoDB Atlas from environment (if available)
    if (process.env.MONGO_URI) {
        config.databases = config.databases || [];

        // config.databases.push(process.env.MONGO_URI);
        if (process.env.MONGO_URI) {
            config.databases = config.databases || [];

            const exists = config.databases.includes(process.env.MONGO_URI);

            if (!exists) {
                config.databases.push(process.env.MONGO_URI);
            }
        }
    }

    return config;
}

module.exports = loadConfig;