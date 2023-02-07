export type SendMailStatus = 200 | 400 | 500
export type SendMailResponse = {
    status: SendMailStatus
    statusTxt: string
}


const MailTemplateNames = ['gameInvitation', 'gameZusage', 'gameAbsage', 'testMail'] as const
export type MailTemplateType = typeof MailTemplateNames[number]
export const isMailTemplate = (value: any): value is MailTemplateType => {
    return MailTemplateNames.some(n => n === value)
}

export const MailTemplates: {[key in MailTemplateType]: string} = {
    "gameAbsage": "gameAbsage",
    "gameZusage": "gameZusage",
    "gameInvitation": "gameInvitation",
    "testMail": "testMail"
}



