const fs = require("fs");

const {
    S3Client,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");

const client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: "auto",

    credentials: {
        accessKeyId:
            process.env.S3_ACCESS_KEY,

        secretAccessKey:
            process.env.S3_SECRET_KEY,
    },

    forcePathStyle: true,
});

async function uploadBackup(
    filePath,
    databaseType
) {

    const fileStream =
        fs.createReadStream(filePath);

    const fileName =
        filePath.split("/").pop();

    const key =
        `${databaseType}/${fileName}`;

    await client.send(
        new PutObjectCommand({
            Bucket:
                process.env.S3_BUCKET,

            Key: key,

            Body: fileStream,
        })
    );

    return key;
}

module.exports = uploadBackup;