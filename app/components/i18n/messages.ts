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
    }
};


export default messages;