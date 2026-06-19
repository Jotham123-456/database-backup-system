function getDatabaseInfo(url) {
  if (url.startsWith("postgresql://")) {
    const dbName = url.split("/").pop().split("?")[0];

    return {
      type: "postgresql",
      databaseName: dbName,
    };
  }

  if (url.startsWith("mongodb://") || url.startsWith("mongodb+srv://")) {
    const cleanUrl = url.split("/").pop()?.split("?")[0];

    return {
      type: "mongodb",
      databaseName: cleanUrl || "mongodb",
    };
  }

  return {
    type: "unknown",
    databaseName: url,
  };
}

module.exports = getDatabaseInfo;