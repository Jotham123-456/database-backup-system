const fs = require("fs");
const path = require("path");

const historyFile = path.join(
    process.cwd(),
    "src",
    "data",
    "history.json"
);

function add(entry) {

    let history = [];

    if (fs.existsSync(historyFile)) {
        history = JSON.parse(
            fs.readFileSync(historyFile, "utf8")
        );
    }

    history.unshift(entry);

    fs.writeFileSync(
        historyFile,
        JSON.stringify(history, null, 2)
    );
}

function getAll() {

    if (!fs.existsSync(historyFile))
        return [];

    return JSON.parse(
        fs.readFileSync(historyFile, "utf8")
    );
}

module.exports = {
    add,
    getAll
};