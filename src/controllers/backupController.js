const fs = require("fs");
const path = require("path");

const backupDatabase = require("../backup/backupManager");
const uploadBackup = require("../cloud/uploadToSupabase");

const {
  sendSuccessEmail,
  sendFailureEmail,
} = require("../notifications/email");

const log = require("../utils/logger");

const dbPath = path.join(process.cwd(), "src/data/databases.json");

// ----------------------
// Retry helper
// ----------------------
async function retry(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      log(`Retry ${i + 1} failed: ${err.message}`, "WARN");

      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
}

// ----------------------
// MAIN BACKUP FUNCTION
// ----------------------
async function runBackup() {

  const databases = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  if (!Array.isArray(databases) || databases.length === 0) {
    throw new Error("No databases configured.");
  }

  for (const db of databases) {

    const info = {
      databaseName: db.slug || db.name,   // 🔥 IMPORTANT FIX
      type: db.type,
    };

    const databaseUrl = db.url;

    const start = Date.now();

    try {

      log(`Starting backup: ${info.databaseName}`);

      const backupFile = await backupDatabase(info, databaseUrl);

      log(`Backup created: ${backupFile}`);

      const stats = fs.statSync(backupFile);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      const uploadResult = await retry(() =>
        uploadBackup(backupFile, info)
      );

      log(`Uploaded: ${uploadResult.path}`);

      fs.unlinkSync(backupFile);

      const duration = Date.now() - start;

      await sendSuccessEmail({
        databaseName: info.databaseName,
        databaseType: info.type,
        backupSize: `${sizeMB} MB`,
        location: uploadResult.path,
        duration: `${duration}ms`,
      });

      log(`Backup success: ${info.databaseName}`, "SUCCESS");

    } catch (error) {

      log(`Backup failed: ${info.databaseName}`, "ERROR");
      log(error.message, "ERROR");

      await sendFailureEmail({
        databaseName: info.databaseName,
        databaseType: info.type,
        error,
      });
    }
  }

  return {
    success: true,
    message: "All backups completed."
  };
}

// ----------------------
// API
// ----------------------
async function triggerBackup(req, res) {
  try {
    log("Manual backup started");

    const result = await runBackup();

    res.json(result);

  } catch (error) {
    log(error.message, "ERROR");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  runBackup,
  triggerBackup,
};