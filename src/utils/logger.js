const fs = require("fs");
const path = require("path");

const logFilePath = path.join(
    process.cwd(),
    "logs",
    "app.log"
);

function log(message, type = "INFO") {

    const timestamp = new Date().toISOString();

    const logMessage =
        `[${timestamp}] [${type}] ${message}\n`;

    // print to terminal
    console.log(logMessage);

    // append to file
    fs.appendFileSync(logFilePath, logMessage);
}

module.exports = log;