const { exec } = require("child_process");
const path = require("path");

function backupMongo(databaseUrl, databaseName) {

  return new Promise((resolve, reject) => { //creates a new Promise that will be resolved or rejected based on the success or failure of the backup operation

    const timestamp = Date.now();

    const backupFile = path.join(
      process.cwd(),
      "backups",
      `${databaseName}_${timestamp}.archive`//creates a backup of the database using mongodump command and saves it to the specified backupFile path
    );

    const command =
      `mongodump --uri="${databaseUrl}" --archive="${backupFile}"`;//creates a backup of the database using mongodump command and saves it to the specified backupFile path

    exec(command, (error) => {

      if (error) {
        return reject(error);
      }

      resolve(backupFile);
    });

  });

}

module.exports = backupMongo;