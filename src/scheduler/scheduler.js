const cron = require("node-cron");
const log = require("../utils/logger");

let jobStarted = false;
let isRunning = false;

function startScheduler(runBackupFunction, config) {

    if (jobStarted) {
        log("Scheduler already running — skipping duplicate start", "WARN");
        return;
    }

    jobStarted = true;

    const schedule = config.schedule || "0 * * * *";

    log(`Scheduler started with: ${schedule}`);

    cron.schedule(schedule, async () => {

        // Prevent overlapping runs
        if (isRunning) {
            log("Previous backup still running — skipping this cycle", "WARN");
            return;
        }

        isRunning = true;

        log("⏰ Running scheduled backup...");

        try {
            await runBackupFunction();
        } catch (err) {
            log(`Scheduled backup failed: ${err.message}`, "ERROR");
        } finally {
            isRunning = false;
        }

    });

}

module.exports = startScheduler;