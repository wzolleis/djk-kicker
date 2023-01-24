import nodemailer from 'nodemailer'
import invariant from "tiny-invariant";
import {SendMailResponse} from "~/config/mailTypes";

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
                          }: { mailTo: string, mailFrom: string, subject: string, body: string }): Promise<SendMailResponse> => {
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
                console.warn("WARN:keine Mail gesendet, Feature ist nicht aktiv")
                return {status: 400, statusTxt: "WARN:keine Mail gesendet, Feature ist nicht aktiv"}
            }

            console.log(`Sending mail to "${mailTo}"...`)
            const mailSender = `"${mailFrom}" <${mailFrom}>`
            const info = await transport.sendMail({
                from: mailSender, // sender address
                to: mailTo, // list of receivers (nur einer)
                subject,
                text: body,
                html: `<p>${body}</p>`, // html body
            });

            console.log("result sending mail: ", info)
            return {status: 200, statusTxt: "OK"}
        } catch (error) {
            console.error(`ERROR: Fehler beim Senden der Mail an ${mailTo}: ${JSON.stringify(error)}`)
            return {status: 500, statusTxt: `ERROR: Fehler beim Senden der Mail an ${mailTo}`}
        }
    }
}

const sendTestMail = async ({numberOfMails}: { numberOfMails: number } = {numberOfMails: 1}) => {
    const mailFrom = process.env.MAIL_FROM
    const mailTo = process.env.TEST_MAIL_TO
    let subject = ""
    let body = ""

    invariant(!!mailFrom)
    invariant(!!mailTo)

    for (let i = 0; i < numberOfMails; i++) {
        subject = `Testmail - ${i + 1}`
        body = `DJK-Kicker Testmail - ${i + 1}`
        await mailSender({mailTo, mailFrom, subject, body})
    }

    invariant(!!mailTo)
}

const sendMail = async ({
                            mailTo,
                            subject,
                            body
                        }: { mailTo: string, subject: string, body: string }): Promise<SendMailResponse> => {
    const mailFrom = process.env.MAIL_FROM
    invariant(!!mailFrom)
    return mailSender({mailTo, mailFrom, subject, body})
}

export default {
    sendMail,
    sendTestMail
}