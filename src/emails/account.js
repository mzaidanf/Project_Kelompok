const mailgun = require('mailgun-js');
const mailgunAPIKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: mailgunAPIKey, domain });

const sendWelcomeEmail = (email, name) => {
    mg.messages().send(
        {
            from: 'Mailgun Sandbox <fatwaaryasatyaakbar@gmail.com>',
            to: email,
            subject: 'Thanks for joining in to NoxTask! ',
            text: `Welcome to the NoxTask, ${name}. Let me know how you get along with the NoxTask.`
        },
        (error, body) => {
            if (error) {
                console.log(error);
            }
        }
    );
}
const sendCancellationEmail = (email, name) => {
    mg.messages().send(
        {
            from: 'Mailgun Sandbox <fatwaaryasatyaakbar@gmail.com>',
            to: email,
            subject: 'Sorry to see you go!',
            text: `Goodbye, ${name}. I hope to see you back sometime soon.`
        },
        (error, body) => {
            if (error) {
                console.log(error);
            }
        }
    );
}



module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}