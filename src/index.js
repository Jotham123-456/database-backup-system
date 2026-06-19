const log = require("./utils/logger");
require("dotenv").config();

const fs = require("fs");

const {
  sendSuccessEmail,
  sendFailureEmail,
} = require("./notifications/email");

const loadConfig =
  require("./config/configLoader");

const getDatabaseInfo =
  require("./config/databaseInfo");

const backupDatabase =
  require("./backup/backupManager");

const uploadBackup =
  require("./cloud/uploadToSupabase");

const startScheduler =
  require("./scheduler/scheduler");

// ----------------------
// Retry helper (stable version)
// ----------------------
// async function retry(fn, retries = 3, delay = 2000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await fn();
//     } catch (err) {
//       log(`Retry ${i + 1} failed: ${err.message}`, "WARN");

//       if (i < retries - 1) {
//         await new Promise((res) => setTimeout(res, delay));
//       } else {
//         throw err;
//       }
//     }
//   }
// }


async function retry(fn, retries = 3, delay = 2000) {

  for (let i = 0; i < retries; i++) {

    try {
      return await fn();

    } catch (err) {

      console.warn(`Retry ${i + 1} failed: ${err.message}`);

      if (i < retries - 1) {
        await new Promise(res =>
          setTimeout(res, delay)
        );
      } else {
        throw err;
      }
    }
  }
}


// ----------------------
// MAIN BACKUP LOGIC
// ----------------------
async function runBackup() {

  const config = loadConfig();

  for (const databaseUrl of config.databases) {

    const info = getDatabaseInfo(databaseUrl);

    const start = Date.now();

    try {
      log(`Starting backup: ${info.databaseName}`);

      const backupFile =
        await backupDatabase(info, databaseUrl);

      log(`Backup created: ${backupFile}`);

      // File size calculation
      const stats = fs.statSync(backupFile);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      const uploadResult =
        await retry(() =>
          uploadBackup(backupFile, info)
        );

      const duration = Date.now() - start;

      log(`Uploaded: ${uploadResult.path}`);

      // Delete local backup after upload
      fs.unlinkSync(backupFile);

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
      log(`Error: ${error.message}`, "ERROR");

      await sendFailureEmail({
        databaseName: info.databaseName,
        databaseType: info.type,
        error,
      });
    }
  }
}

// ----------------------
// START SYSTEM
// ----------------------
async function startSystem() {

  const config = loadConfig();

  log("Database Backup System Started");

  // run immediately
  await runBackup();

  // start scheduler
  startScheduler(runBackup, config);

  log("Scheduler initialized");
}

let started = false;

if (!started) {
  started = true;
  startSystem();
};