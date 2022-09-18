const nodemailer = require("nodemailer");
const ejs = require("ejs");

const sendEmail = async (email, subject, verifyURL, name, ejsFile) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_APP_PASSWORD,
            },
        });

        const data = await ejs.renderFile(`views/${ejsFile}`, {
            name: name,
            siteURL: process.env.URL,
            siteName: process.env.SITE_NAME,
            redirectURL: verifyURL,
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: data,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;
