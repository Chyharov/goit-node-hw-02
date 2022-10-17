const sgMail = require('@sendgrid/mail');
const { sendgridApiKey } = require('../config');

function sendEmail({ to, subject, html }) {
    sgMail.setApiKey(sendgridApiKey);

    sgMail.send({
        from: 'chyharov@gmail.com',
        to,
        subject,
        html,
    });
}

module.exports = sendEmail;
