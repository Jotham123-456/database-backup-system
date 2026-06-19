const { exec } = require("child_process");
const path = require("path");

function backupPostgres(databaseUrl, databaseName) {
  return new Promise((resolve, reject) => {

    const timestamp = Date.now();

    const backupFile = path.join(
      process.cwd(),
      "backups",
      `${databaseName}_${timestamp}.sql`
    );

    const command =
      `pg_dump "${databaseUrl}" > "${backupFile}"`;//creates a backup of the database using pg_dump command and saves it to the specified backupFile path

    exec(command, (error) => {

      if (error) {
        return reject(error);
      }

      resolve(backupFile);
    });

  });
}

module.exports = backupPostgres;