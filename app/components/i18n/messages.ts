import {spielortOptions} from "~/helpers/constants/admin.game.constants";

const messages = {
    app: {
        welcome: "Willkommen bei den DJK Kickern",
        title: "DJK Kicker"
    },
    appmenu: {
        administration: "Verwaltung",
        gameadministration: "Spieleverwaltung",
        games: "Alle Spiele",
        login: 'Anmelden',
        logout: 'Abmelden'
    },
    commonForm: {
        cancel: "Abbruch"
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
    game: {
        players: {
            title: "Spieler",
            add: "Hinzufügen",
            status: {
                undefined: "Unbekannt",
                confirmed: "Zugesagt",
                declined: "Abgesagt"
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

    warnings: {
        noToken: "Du bist nicht berechtigt einen Status abzusenden oder einen neuen Spieler anzulegen, da du diese Seite ohne einen gültigen Einladungslink besucht hast. Rufe die Seite entweder über einen gültigen Einladungslink auf oder wende dich an einen Administrator."
    },
    mailContent: {
        invitationMail: {
            mailSubject: (datum: string) => `Einladung für das DJK-Kicker Fussballspiel am ${datum}`,
            mailBody: ({datum, spielOrt, einladungsLink, playerName}: {datum: string, spielOrt: string, einladungsLink: string, playerName: string}) => `Hallo ${playerName}
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