const nodemailer = require("nodemailer");

function createTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}


async function sendSuccessEmail({
    databaseName,
    databaseType,
    backupSize,
    location,
    duration,
}) {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAILS,
        subject: `✅ Backup Successful: ${databaseName}`,
        text: `
Database: ${databaseName}
Type: ${databaseType}
Size: ${backupSize}
Location: ${location}
Duration: ${duration}
Time: ${new Date().toISOString()}
    `,
    };

    await transporter.sendMail(mailOptions);
}


async function sendFailureEmail({
    databaseName,
    databaseType,
    error,
}) {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAILS,
        subject: `❌ Backup Failed: ${databaseName}`,
        text: `
Database: ${databaseName}
Type: ${databaseType}
Error: ${error.message}
Time: ${new Date().toISOString()}

Suggested Fix:
- Check database connection
- Check credentials
- Check server status
    `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendSuccessEmail,
    sendFailureEmail,
};