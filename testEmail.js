require("dotenv").config();

const nodemailer = require("nodemailer");

async function test() {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const result = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "Test Email",
        text: "If you see this, email works",
    });

    console.log(result);
}

test();