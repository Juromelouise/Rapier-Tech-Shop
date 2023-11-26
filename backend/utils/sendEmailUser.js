const nodemailer = require('nodemailer');

const sendEmailUser = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `Rapier TechShop <admin@gmail.com`,
        to: options.email,
        subject: options.subject,
        html: options.messageUser
    }

    await transporter.sendMail(message)
}

module.exports = sendEmailUser;