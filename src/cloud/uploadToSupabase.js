const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const supabase = require("./supabaseClient");
const log = require("../utils/logger");

function slugify(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
}

async function uploadBackup(localFile, databaseInfo) {

    const fileName = path.basename(localFile);

    const safeDbName = slugify(databaseInfo.databaseName);

    const cloudPath =
        `${databaseInfo.type}/${safeDbName}/${fileName}`;

    const fileBuffer = fs.readFileSync(localFile);

    log(`Uploading backup: ${cloudPath}`);

    const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(cloudPath, fileBuffer, {
            contentType:
                mime.lookup(localFile) ||
                "application/octet-stream",
            upsert: false,
        });

    log(`UPLOAD DATA: ${JSON.stringify(data)}`);
    log(`UPLOAD ERROR: ${JSON.stringify(error)}`);

    if (error) throw error;

    return data;
}

module.exports = uploadBackup;