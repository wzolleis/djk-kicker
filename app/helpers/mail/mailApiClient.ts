import {MailTemplateType} from "~/config/mailTypes";
import messages from "~/components/i18n/messages";

type GameMail = {
    mail: {
        template: MailTemplateType
    },
    variables: {
        event: {
            date: string
            location: string
            name: string
            subject: string
        }
    },
    recipients: MailRecipient[]
}

export type MailRecipient = {
    mailAddress: string
    variables: {
        name: string
        invitationLink: string
    }
}

export type EventData = {
    location: string
    date: string
    name: string
}

export class MailBuilder {
    event: EventData

    recipients: MailRecipient[]

    templateName: MailTemplateType

    constructor(param: {
        templateName: MailTemplateType
        event: EventData
    }) {
        this.event = param.event
        this.templateName = param.templateName
        this.recipients = []
    }

    addRecipient(recipient: MailRecipient) {
        this.recipients.push(recipient)
    }

    buildMail(): GameMail {
        let subject = "unknown subject"
        switch(this.templateName) {
            case "testMail":
                subject = "TestMail - bitte löschen"
                break
            case "gameInvitation":
                subject = messages.gameStatus.invitation(this.event.date)
                break
            case "gameZusage":
                subject = messages.gameStatus.zusage(this.event.date)
                break
            case "gameAbsage":
                subject = messages.gameStatus.absage(this.event.date)
                break
        }

        return {
            mail: {
                template: this.templateName
            },
            variables: {
                event: {
                    location: this.event.location,
                    date: this.event.date,
                    name: this.event.name,
                    subject
                }
            },
            recipients: this.recipients
        }
    }
}