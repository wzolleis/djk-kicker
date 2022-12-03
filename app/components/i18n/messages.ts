import {spielortOptions} from "~/helpers/constants/admin.game.constants";

const messages = {
    app: {
        welcome: "Willkommen bei den DJK Kickern",
        title: "DJK Kicker"
    },
    buttons: {
        edit: 'Bearbeiten',
        save: 'Speichern',
        back: 'Zurück',
        add: 'Hinzufügen'
    },
    appmenu: {
        administration: "Verwaltung",
        gameadministration: "Spieleverwaltung",
        useradministration: "Benutzerverwaltung",
        games: "Alle Spiele",
        login: 'Anmelden',
        logout: 'Abmelden'
    },
    commonForm: {
        cancel: "Abbruch",
        date: "Datum",
        timeSuggestion: "Zeit-Vorschlag",
        dateSuggestion: "Datum-Vorschlag",
        time: "Uhrzeit",
        year: "Jahr",
        month: "Monat",
        day: "Tag",
        hour: "Stunde",
        minute: "Minuten"
    },
    loginform: {
        welcome: "DJK Kicker - Anmeldung",
        description: "Viel Spaß beim Bolzen",
        email: "Email",
        password: "Passwort",
        login: "Anmelden",
        rememberMe: "Anmeldedaten speichern",
        createAccount: "Neuen Account anlegen"
    },
    joinForm: {
        backToLogin: "Zur Anmeldung",
        createAccount: "Neuen Account anlegen"
    },
    adminGamesForm: {
        name: "Name",
        new: "Neu"
    },
    adminGameActionsForm: {
        title: 'Ausgeführte Aktionen',
        noActions: 'Es wurden noch keine Aktionen ausgeführt'
    },
    adminCreateGameForm: {
        newGame: "Neues Spiel anlegen",
        gameTime: "Datum",
        name: "Name",
        submit: "Speichern",
        submitting: "Speichere..."
    },
    adminEditGameForm: {
        title: "Spiel aktualisieren",
        gameTime: "Datum",
        name: "Name",
        spielort: "Spielort",
        optionHalle: "Halle",
        optionDraussen: "Draussen",
        update: "Speichern",
        updating: "Speichere...",
        delete: "Löschen",
        deleting: "Lösche...",
        deleteConfirmation: "Das Spiel wirklich löschen ?",
        gameDeleted: "Das Spiel wurde gelöscht"
    },
    adminLandingPage: {
        title: "Verwaltung",
        games: "Spiele",
        gamesDescription: "Spiele anlegen, Spiele absagen, usw...",
        users: "Benutzerverwaltung",
        usersDescription: "Berechtigungen und so ein Quatsch"
    },
    adminOverviewTable: {
        name: 'Name',
        email: 'E-Mail',
        role: 'Rolle',
    },

    adminInvitationOverviewTable: {
        name: 'Name',
        email: 'E-Mail',
        status: 'Status',
        expiresAt: 'Läuft ab'
    },

    game: {
        players: {
            title: "Spieler",
            add: "Hinzufügen",
        },
        count: {
            confirmedPlayers: "Zusagen",
            declinedPlayers: "Absagen",
            undecidedPlayers: "Unentschlossen",
            unknownPlayers: "Unbekannt"
        },
        feedback: {
            status: {
                translations: {
                    unknown: "Unbekannt",
                    declined: "Abgesagt",
                    confirmed: "Zugesagt",
                    undecided: "Unsicher"

                }
            }


        },
        add: "Spiel hinzufügen",
        filters: {
            all: "Alle Spiele",
            current: "Nächstes Spiel",
            values: {
                all: "all",
                current: "current"
            }
        }
    },
    player: {
        add: "Spieler hinzufügen"
    },

    user: {
        roles: {
            admin: 'Admin',
            player: 'Spieler'
        }
    },

    warnings: {
        noToken: "Du bist nicht berechtigt einen Status abzusenden oder einen neuen Spieler anzulegen, da du diese Seite ohne einen gültigen Einladungslink besucht hast. Rufe die Seite entweder über einen gültigen Einladungslink auf oder wende dich an einen Administrator."
    },
    mailContent: {
        invitationMail: {
            mailSubject: (datum: string) => `Einladung für das DJK-Kicker Fussballspiel am ${datum}`,
            mailBody: ({
                           datum,
                           spielOrt,
                           einladungsLink,
                           playerName
                       }: { datum: string, spielOrt: string, einladungsLink: string, playerName: string }) => `Hallo ${playerName}
<br/>
Einladung für das Spiel am ${datum}.
<br/>
Spielort: ${spielOrt} 
<br/>
Bitte klicke auf die <a href=${einladungsLink}>Einladung</a> und teile uns mit, ob Du kommen kannst.
<br/>
Verwende den Link bitte auch, wenn Du Deine Entscheidung nochmal ändern möchtest.
<br/>
<br/>
Vielen Dank 
`
        },
        zusageMail: {
            mailSubject: (datum: string) => `Das Spiel der DJK-Kicker am ${datum} findet statt`,
            mailBody: ({
                           datum,
                           spielOrt,
                           playerName
                       }: { datum: string, spielOrt: string, playerName: string }) => `Hallo ${playerName}
<br/>
<h4> &#127952; Das Spiel findet statt. &#127952;</h4>
<p>
Datum: ${datum}
<br/>
Spielort: ${spielOrt}
</p> 
Vielen Dank für Deine Rückmeldung.
<br/>
Viele Grüße 
`
        },
        absageMail: {
            mailSubject: (datum: string) => `Das Spiel der DJK-Kicker am ${datum} fällt aus `,
            mailBody: ({
                           datum,
                           playerName
                       }: { datum: string, playerName: string }) => `Hallo ${playerName},
<br/>
<h3>
&#128557; Wir spielen nicht !!!  &#128557;
</h3>
<h4>Das Spiel am ${datum} fällt aus. </h4>
</p> 
Vielen Dank für Deine Rückmeldung.
<br/>
<br/>
Viele Grüße
`
        }
    },
    adminGameZusageForm: {
        titleGame: "Zusage für das Spiel am: ",
        titleGameTime: "Spielort: ",
        mailBodyLabel: "Nachricht",
        mailReceiver: "An:",
        sendZusageBtn: 'Zusage verschicken',
        spielort: (optionValue: string) => `${Number.parseInt(optionValue) === spielortOptions.halle.value ? 'in der Halle' : 'draußen'}`,
        mailSubjectLabel: "Betreff",
    },
    adminGameAbsageForm: {
        titleGame: "Absage für das Spiel am: ",
        titleGameTime: "Spielort: ",
        mailBodyLabel: "Nachricht",
        mailReceiver: "An:",
        sendAbsageBtn: 'Absage verschicken',
        spielort: (optionValue: string) => `${Number.parseInt(optionValue) === spielortOptions.halle.value ? 'in der Halle' : 'draußen'}`,
        mailSubjectLabel: "Betreff",
    },
    adminGameInvitationForm: {
        titleGame: "Einadung für das Spiel am: ",
        invitationLink: 'Einladungslink',
        titleGameTime: "Spielort: ",
        mailBodyLabel: "Nachricht",
        mailReceiver: "An:",
        sendInvitationBtn: 'Einladung verschicken',
        spielort: (optionValue: string) => `${Number.parseInt(optionValue) === spielortOptions.halle.value ? 'in der Halle' : 'draußen'}`,
        mailSubjectLabel: "Betreff",
        mailBody: (datum: string) => `Hallo Spieler
Einladung für das Spiel am ${datum}.
Spielort: Halle/Draußen 

Bitte klicke auf die Einladung und teile uns mit, ob Du kommen kannst.
Verwende den Link bitte auch, wenn Du Deine Entscheidung nochmal ändern möchtest.

Vielen Dank 
`
    }
};


export default messages;