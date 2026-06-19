const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const supabase = require("./supabaseClient");
const log = require("../utils/logger");


async function uploadBackup(localFile, databaseInfo) {

    const fileName = path.basename(localFile);

    const cloudPath =
        `${databaseInfo.type}/${databaseInfo.databaseName}/${fileName}`;

    const fileBuffer = fs.readFileSync(localFile);


    // log({
    //     type: databaseInfo.type,
    //     databaseName: databaseInfo.databaseName,
    //     fileName,
    //     cloudPath
    // });//////////////////////////


    log(
        `Uploading backup: ${cloudPath}`
    );


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

    if (error) {
        throw error;
    }

    return data;
}

module.exports = uploadBackup;