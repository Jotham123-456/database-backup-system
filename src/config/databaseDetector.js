function detectDatabaseType(url) {
  if (url.startsWith("postgresql://")) {// Check for PostgreSQL connection string
    return "postgresql";
  }

  if (url.startsWith("mongodb://")) {// Check for MongoDB connection string
    return "mongodb";
  }

  return "unknown";
}

module.exports = detectDatabaseType;// This function detects the type of database based on the connection string URL. 
// It checks for specific prefixes to identify PostgreSQL and MongoDB, returning "unknown" if the type cannot be determined.