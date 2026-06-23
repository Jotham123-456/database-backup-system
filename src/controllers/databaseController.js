const fs = require("fs");
const path = require("path");

const dbPath = path.join(process.cwd(), "src/data/databases.json");

// --------------------
// helper: safe read
// --------------------
function readDB() {
    try {
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, "[]");
        }

        const raw = fs.readFileSync(dbPath, "utf8");
        return JSON.parse(raw || "[]");

    } catch (err) {
        console.error("DB read error:", err.message);
        return [];
    }
}

// --------------------
// helper: slugify
// --------------------
function slugify(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
}

// --------------------
// GET all databases
// --------------------
function getDatabases(req, res) {
    const data = readDB();
    res.json(data);
}

// --------------------
// ADD database
// --------------------
function addDatabase(req, res) {
    try {
        const { name, type, url } = req.body;

        if (!name || !type || !url) {
            return res.status(400).json({
                message: "Missing fields"
            });
        }

        const allowedTypes = ["postgresql", "mongodb"];

        if (!allowedTypes.includes(type)) {
            return res.status(400).json({
                message: "Invalid database type"
            });
        }

        const data = readDB();

        const slug = slugify(name);

        // prevent duplicates by slug
        const exists = data.find(db => db.slug === slug);

        if (exists) {
            return res.status(400).json({
                message: "Database already exists"
            });
        }

        const newDB = {
            name,        // original name (UI)
            slug,        // safe name (system)
            type,
            url
        };

        data.push(newDB);

        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

        return res.json({
            success: true,
            message: "Database added successfully",
            database: newDB
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    getDatabases,
    addDatabase
};