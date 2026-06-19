const backupPostgres =
  require("./postgresBackup");//access the backupPostgres function from the postgresBackup.js file

const backupMongo =
  require("./mongoBackup");//access the backupMongo function from the mongoBackup.js file

console.log("backupPostgres:", typeof backupPostgres);


console.log("backupMongo:", backupMongo);
console.log("Type of backupMongo:", typeof backupMongo);

async function backupDatabase(info, url) {

  if (info.type === "postgresql") {//creates a conditional statement that checks the type of database specified in the info object. If the type is "postgresql", it calls the backupPostgres function with the provided url and databaseName from the info object. If the type is "mongodb", it calls the backupMongo function with the same parameters. If the type is neither, it throws an error indicating that the database type is unsupported.
    return backupPostgres(
      url,
      info.databaseName
    );
  }

  if (info.type === "mongodb") {//creates a conditional statement that checks the type of database specified in the info object. If the type is "postgresql", it calls the backupPostgres function with the provided url and databaseName from the info object. If the type is "mongodb", it calls the backupMongo function with the same parameters. If the type is neither, it throws an error indicating that the database type is unsupported.
    return backupMongo(
      url,
      info.databaseName
    );
  }

  throw new Error(
    `Unsupported database type: ${info.type}`
  );

}

module.exports = backupDatabase;