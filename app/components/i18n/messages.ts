import {spielortOptions} from "~/helpers/constants/admin.game.constants";

const messages = {
    app: {
        welcome: "Willkommen bei den DJK Kickern",
        title: "DJK Kicker"
    },
    appmenu: {
        administration: "Verwaltung",
        gameadministration: "Spieleverwaltung",
        games: "Alle Spiele"
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

    tooltips: {
        games: {
            overview: "Du siehst dir gerade einer Übersicht aller Spiele an. Solltest Du keinen gültigen Einladungslink haben, kannst Du hier nach dem aktuellsten Spiel suchen."
        }
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