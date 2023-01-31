export type MailTemplateName = 'Invitation'

type GameInvitationData = {
    mailAddress: string

    invitationLink: string
    playerName: string
}

export type InvitationMailRecipient = {
    mailAddress: string
    variables: {
        name: string
        invitationLink: string
    }
}

export type GameInvitationMail = {
    mail: {
        template: MailTemplateName
    },
    globalVariables: {
        game: {
            date: string
            location: string
        }
    }
    recipients: InvitationMailRecipient[]
}

export class MailBuilder {
    invitations: GameInvitationData[]
    gameLocation: string
    gameDate: string

    constructor(param: {
        templateName: MailTemplateName
        gameLocation: string
        gameDate: string
    }) {
        this.gameLocation = param.gameLocation
        this.gameDate = param.gameDate
        this.invitations = []
    }

    addInvitation(invitation: GameInvitationData) {
        this.invitations.push(invitation)
    }

    buildInvitationMail(): GameInvitationMail {
        const recipients: InvitationMailRecipient[] = this.invitations.map(invitation => {
            return {
                mailAddress: invitation.mailAddress,
                variables: {
                    name: invitation.playerName,
                    invitationLink: invitation.invitationLink
                }
            }
        })

        return {
            mail: {
                template: "Invitation"
            },
            globalVariables: {
                game: {
                    date: this.gameDate,
                    location: this.gameLocation
                }
            },
            recipients
        }
    }
}