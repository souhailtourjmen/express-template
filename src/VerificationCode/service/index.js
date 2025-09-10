const nodemailer = require("nodemailer");
const { getEmailTemplate } = require("../../utils");

const sendVerificationEmail = async(email, code, emailType = "verification") => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const userOptions = {
        name: email.split("@")[0],
        code: code,
        email: email,
    };
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: userOptions.email,
        ...getEmailTemplate(emailType, userOptions),
    };

    await transporter.sendMail(mailOptions);
};
module.exports = {
    sendVerificationEmail
};