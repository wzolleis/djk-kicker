import nodemailer, {SentMessageInfo} from 'nodemailer'
import invariant from "tiny-invariant";

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

const mailSender = async ({
                              mailTo,
                              mailFrom,
                              subject,
                              body
                          }: { mailTo: string, mailFrom: string, subject: string, body: string }): Promise<SentMessageInfo> => {
    if (!mailConfig.host) console.error('mail host not set')
    if (!mailConfig.auth.user) console.error('mail user not set')
    if (!mailConfig.auth.pass) console.error('mail pass not set')
    if (!mailTo) console.error('mailTo not set')
    if (!mailFrom) console.error('mailFrom not set')

    if (!mailConfig.host || !mailConfig.auth.user || !mailConfig.auth.pass || !mailTo || !mailFrom) {
        console.error("Fehlerhafte Mail-Konfiguration")
        throw new Error("Fehlerhafte Mail-Konfiguration")
    } else {
        try {
            if (process.env.FEATURE_SEND_MAIL_ACTIVE !== 'true') {
                console.log("keine Mail gesendet, Feature ist nicht aktiv")
                return new Error(`keine Mail gesendet, Feature ist nicht aktiv`)
            }

            console.log("Sending mail....")
            const mailSender = `"${mailFrom}" <${mailFrom}>`
            const recipients = `${mailTo}`

            const info = await transport.sendMail({
                from: mailSender, // sender address
                to: recipients, // list of receivers
                subject,
                text: body,
                html: `<p>${body}</p>`, // html body
            });

            console.log("result sending mail: ", info)
            return info
        } catch (error) {
            console.log("ERROR SENDING MAIL", error)
            throw new Error(`Fehler beim Senden der Mail an ${mailTo}`)
        }
    }
}

const sendTestMail = async () => {
    const mailFrom = process.env.MAIL_FROM
    const mailTo = process.env.TEST_MAIL_TO
    const body = "DJK-Kicker Testmail"
    const subject = ""

    invariant(!!mailFrom)
    invariant(!!mailTo)

    await mailSender({mailTo, mailFrom,  subject, body})
    invariant(!!mailTo)
}

const sendMail = async ({mailTo, subject, body}: { mailTo: string, subject: string, body: string }): Promise<SentMessageInfo> => {
    const mailFrom = process.env.MAIL_FROM
    invariant(!!mailFrom)
    return await mailSender({mailTo, mailFrom, subject, body})
}

export default {
    sendMail,
    sendTestMail
}