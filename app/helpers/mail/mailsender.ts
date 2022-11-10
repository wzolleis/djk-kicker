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
    if (!mailConfig.host) console.error('mail host not set')
    if (!mailConfig.auth.user) console.error('mail user not set')
    if (!mailConfig.auth.pass) console.error('mail pass not set')
    if (!mailTo) console.error('mailTo not set')
    if (!mailFrom) console.error('mailFrom not set')

    if (!mailConfig.host || !mailConfig.auth.user || !mailConfig.auth.pass || !mailTo || !mailFrom) {
        console.error("Fehlerhafte Mail-Konfiguration")
    } else {
        try {
            console.log("Sending mail....")
            const mailSender = `"${mailFrom}" <${mailFrom}>`
            const recipients = `${mailTo}`

            const info = await transport.sendMail({
                from: mailSender, // sender address
                to: recipients, // list of receivers
                subject: "Hello from DJK-Kicker-App✔", // Subject line
                text: "Das ist ein Test - ignore me", // plain text body
                html: "<b>Diese Mail wird direkt über Netlify gesendet, keine Functions</b>", // html body
            });

            console.log("result sending mail: ", info)

            return info
        } catch (error) {
            console.log("ERROR SENDING MAIL", error)
        }
    }
}

export default mailSender