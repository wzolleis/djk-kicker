import nodemailer, {SentMessageInfo} from 'nodemailer'

// Falls komische Fehler beim Versenden auftreten, mal hier nachlesen, viel Glück :D
// https://stackoverflow.com/questions/66317125/node-js-nodemailer-error-wrong-version-number-invalid-greeting
export const handler = async (event: any, context: any, callback: any) => {
    if (event.httpMethod !== 'POST') {
        return {statusCode: 405, body: 'Method Not Allowed', headers: {'Allow': 'POST'}}
    }

    if(process.env.FEATURE_SEND_MAIL_ACTIVE !== 'true') {
        throw new Error("die Funktion ist nicht aktiv")
    }

    const mailConfig = {
        host: process.env.MAIL_HOST,
        port: Number.parseInt(process.env.MAIL_PORT || ''),
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        tls: {
            ciphers: 'SSLv3'
        }
    }

    const mailTo = process.env.TEST_MAIL_TO
    const mailFrom = process.env.MAIL_FROM
    let message = []

    if (!mailConfig.host) message.push('mail host not set')
    if (!mailConfig.port) message.push('mail port not set')
    if (Number.isNaN(mailConfig.port)) message.push("mail port is not a valid number")
    if (!mailConfig.auth.user) message.push('mail user not set')
    if (!mailConfig.auth.pass) message.push('mail pass not set')
    if (!mailTo) message.push('mailTo not set')
    if (!mailFrom) message.push('mailFrom not set')

    if (message.length > 0) {
        console.error("Fehlerhafte Mail-Konfiguration")
        const error: Error = {name: 'Fehlerhafte Mail-Konfiguration', message: message.join("; ")}
        return callback(null, {statusCode: 400, body: JSON.stringify(error)})
    }
    try {
        console.log("create transport....")
        const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: mailConfig.port,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                ciphers: 'SSLv3'
            }
        })

        const mailSender = `"${mailFrom}" <${mailFrom}>`
        const recipients = `${mailTo}`

        console.log('sending mail...')
        const info: SentMessageInfo = await transport.sendMail({
            from: mailSender, // sender address
            to: recipients, // list of receivers
            subject: "Hello from DJK-Kicker-App✔", // Subject line
            text: "Das ist ein Test  mit Netlify Functions- ignore me", // plain text body
            html: "<b>Viele Grüße von den Netlify Functions</b>", // html body
        });
        console.log("result sending mail: ", info)
        return callback(null, {statusCode: 200, body: JSON.stringify(info)})
    } catch (error) {
        console.error("Fehler beim Versenden der Mail: ", error)
        const errorObj: Error = {name: 'Fehler beim Senden der Mail', message: JSON.stringify(error)}
        return callback(null, {statusCode: 500, body: JSON.stringify(errorObj)})
    }
}
