import nodemailer from 'nodemailer'

// Falls komische Fehler beim Versenden auftreten, mal hier nachlesen, viel Glück :D
// https://stackoverflow.com/questions/66317125/node-js-nodemailer-error-wrong-version-number-invalid-greeting
const mailConfig = {
    host: process.env.MAIL_HOST,
    port: Number.parseInt(process.env.MAIL_PORT || '25'),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3'
    }
}

const transport = nodemailer.createTransport({
    ...mailConfig
})

const mailSender = async () => {
    const mailTo = process.env.TEST_MAIL_TO
    const mailFrom = process.env.MAIL_FROM
    if (!mailConfig.host || !mailConfig.auth.user || !mailConfig.auth.pass || !mailTo || !mailFrom) {
        console.error("Keine Mailkonfiguration vorhanden")
    } else {

        try {
            const mailSender = `"${mailFrom}" <${mailFrom}>`
            const recipients = `${mailTo}`

            const info = await transport.sendMail({
                from: mailSender, // sender address
                to: recipients, // list of receivers
                subject: "Hello from DJK-Kicker-App✔", // Subject line
                text: "Das ist ein Test - ignore me", // plain text body
                html: "<b>Das ist wirklich nur ein Test</b>", // html body
            });

            console.debug("send mail: ", info)
        } catch
            (error) {
            console.log("ERROR SENDING MAIL", error)
        }
    }
}

export default mailSender