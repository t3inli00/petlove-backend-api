const nodemailer = require('nodemailer');

const SmtpTransporter = () => {
    //retrieve SMTP setting
    const smtpHost = process.env.SMTP_HOST || ""
    const smtpPort = process.env.SMTP_PORT || ""
    const smtpUser = process.env.SMTP_USER || ""
    const smtpPassword = process.env.SMTP_PASSWORD || ""
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
        throw new Error('Missing required environment variables for SMTP configuration.');
    }

    //creating the mail transporter
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        auth: {
            user: smtpUser,
            pass: smtpPassword,
        }
    });

    return transporter;
}

module.exports = {SmtpTransporter};



