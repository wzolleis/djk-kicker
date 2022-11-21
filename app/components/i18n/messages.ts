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

    user: {
        roles: {
            admin: 'Admin',
            player: 'Spieler'
        }
    },

    warnings: {
        noToken: "Du bist nicht berechtigt einen Status abzusenden oder einen neuen Spieler anzulegen, da du diese Seite ohne einen gültigen Einladungslink besucht hast. Rufe die Seite entweder über einen gültigen Einladungslink auf oder wende dich an einen Administrator."
    },
    adminGameInvitationForm: {
        titleGame: "Einadung für das Spiel am: ",
        titleGameTime: "Spielort: ",
        mailBodyLabel: "Nachricht",
        mailReceiver: "An:",
        spielort: (optionValue: string) => `${Number.parseInt(optionValue) === spielortOptions.halle.value ? 'in der Halle' : 'draußen'}`,
        mailSubjectLabel: "Betreff",
        mailSubject: (datum: string) => `Einladung für das DJK-Kicker Fussballspiel am ${datum}`,
        mailBody: (datum: string, spielOrt: string) => `Hallo <Name>

Einladung für das Spiel am ${datum}.
Spielort: ${spielOrt}

Bitte klicke auf den <Einladungslink> und teile uns mit, ob Du kommen kannst.
Verwende den Link bitte auch, wenn Du Deine Entscheidung nochmal ändern möchtest.

Vielen Dank 
`
    }
};


export default messages;