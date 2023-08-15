import {AdminInvitationStatus} from "~/config/status";

const spielortLabel = {
    "1": "Draussen",
    "0": "Halle"
}

// @ts-ignore
const messages = {
    app: {
        welcome: "Willkommen bei den DJK Kickern",
        title: "DJK Kicker",
        loading: "Lade Daten...",
        saving: "Speichere Daten...",
        process: "Verarbeite Daten...",
        wait: "Bitte warten...",
        alert: "Achtung"
    },
    buttons: {
        edit: "Bearbeiten",
        save: "Speichern",
        back: "Zurück",
        add: "Hinzufügen",
        remove: "Entfernen",
        cancel: "Abbruch",
        delete: "Löschen",
        reset: "Zurücksetzen",
        invite: "Einladen",
        sendMail: "Mail schicken",
        actionHistory: 'Historie',
        absage: 'Absagen',
        zusage: 'Zusagen',
        details: "Details",
        activate: 'aktivieren',
        deactivate: 'deaktivieren',
        ratings: 'Rating',
        feedback: 'Rückmeldungen'
    },
    actionType: {
        GAME_INVITATION: "Einladung",
        GAME_ZUSAGE: "Zusage",
        GAME_ABSAGE: "Absage"
    },
    appmenu: {
        administration: "Verwaltung",
        gameadministration: "Spieleverwaltung",
        useradministration: "Benutzerverwaltung",
        games: "Alle Spiele",
        createPlayer: "Neuer Spieler",
        dashboard: "Dashboard",
        login: "Als Administrator anmelden",
        logout: "Abmelden",
        changePassword: 'Passwort ändern',
        resetPassword: 'Administrator Passwort zurücksetzen',
        rescue: 'Erste Hilfe'
    },
    commonForm: {
        cancel: "Abbruch",
        date: "Datum",
        timeSuggestion: "Zeiten",
        dateSuggestion: "Nächste Termine",
        gameLocations: "Mögliche Spielorte",
        time: "Uhrzeit",
        year: "Jahr",
        month: "Monat",
        day: "Tag",
        hour: "Stunde",
        minute: "Minuten",
        gameOverCommentOrNothing: (gameDateIsInThePast: boolean) => (gameDateIsInThePast ? "(Game over)" : ""),
        requestType: {
            gameInvitation: 'Einladung',
            gameZusage: 'Zusage',
            gameAbsage: 'Absage',
            testMail: 'Test Mail',
            unknownRequest: 'Request'
        },
        mailStatus: {
            sent: 'Gesendet',
            waiting: 'Wartet'
        }
    },
    dashboard: {
        nextGame: 'Nächstes Spiel',
        playerAndGuests: 'Spieler und Gäste',
        playerStatusForGame: (gameDate: string) => `Deine Antwort für den  ${gameDate}`,
        playerDefaultStatus: "Dein Standard-Status",
        playerProfile: "Dein Profil",
        playerProfileDescription_1: "Dein Profil enthält Deine Kontaktdaten, falls Du diese ändern möchtest, dann wende Dich bitte an einen Administrator.",
        playerProfileDescription_3: "Der Standard-Status wird verwendet, wenn Du keine Rückmeldung für das nächste Spiel setzt und gilt solange, bis Du ihn wieder löscht (zurücksetzt). ",
        playerProfileWarning_1: "Eine Änderung des Standard-Status gilt nicht für das aktuelle Spiel, sondern wirkt sich erst auf zukünftige Spiele aus.",
        playerProfileWarning_2: "Wenn Du z.B. den Wert auf 'Nein' setzt, dann bist du automatisch solange für die nächsten Spiele abgemeldet, bis Du das wieder änderst.",
        saveProfile: "Profil speichern",
        deleteDefaultFeedback: "Standard-Status zurücksetzen"
    },
    bottomNavBar: {
        game: "Spiel",
        feedback: "Antwort",
        profile: "Profil",
        rescue: 'Erste Hilfe',
        administration: "Verwaltung",
        registerPlayer: "Neuer Spieler",
        rating: 'Stars'
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
    changePasswordForm: {
        actualPassword: "Aktuelles Passwort",
        passwordNew: "Neues Passwort",
        passwordRepeat: "Neues Passwort (Wiederholung)",
        changePassword: 'Passwort ändern',
        passwordChanged: 'Passwort wurde geändert'
    },
    resetPasswordForm: {
        title: 'Administrator Passwort zurücksetzen',
        adminMail: 'Admin-Email',
        adminName: 'Admin-Name',
        securityCode: 'Sicherheits-Code',
        passwordNew: 'Neues Passwort',
        resetPassword: 'Passwort zurücksetzen',
        resetPasswordSuccess: 'Passwort wurde zurückgesetzt',
        resetPasswordFailed: 'Es ist ein Fehler aufgetreten'
    },
    errors: {
        noGame: "Kein Spiel vorhanden"
    },
    gameStatus: {
        invitation: (gameDate: string) => `Einladung für das Spiel am ${gameDate}`,
        zusage: (gameDate: string) => `Das Spiel am ${gameDate} findet statt`,
        absage: (gameDate: string) => `Das Spiel am ${gameDate} wurde abgesagt`
    },
    playerRescueForm: {
        title: 'Erste Hilfe',
        rescueDescription: 'Nur im Notfall verwenden',
        emailDescription: 'Bitte gib zuerst deine E-Mail-Adresse ein',
        deleteCookieDescription: 'Session Cookie',
        email: 'E-Mail (Pflichtfeld)',
    },
    adminGamesTable: {
        id: '#',
        name: "Spielname",
        gametime: "Zeit",
        location: "Spielort",
        status: "Status",
        actions: 'Aktionen',
        //@ts-ignore
        spielortTxt: (spielOrtOption: string): string => spielortLabel[spielOrtOption]
    },
    adminGamesForm: {
        name: "Name",
        new: "Neues Spiel anlegen",
        deleteExpired: "Spiele löschen"
    },
    adminSendMailForm: {
        selectRecipient: 'Empfänger auswählen',
        selectTemplate: "Mail Template auswählen",
        addAllRecipients: 'Alle hinzufügen',
        removeAllRecipients: 'Alle entfernen',
        sendMails: "Mails verschicken",
        invitation: "Einladung",
        confirmation: "Zusage",
        cancellation: "Absage",
        freeText: 'Freitext',
        mailSubjectLabel: "Betreff"
    },
    adminUsersForm: {
        invitations: "Einladungen"
    },
    adminGameActionsForm: {
        title: "Verlauf",
        noActions: "Es wurden noch keine Aktionen ausgeführt"
    },
    adminCreateGameForm: {
        newGame: "Neues Spiel anlegen",
        gameTime: "Datum",
        name: "Name",
        submit: "Speichern",
        submitting: "Speichere..."
    },
    adminEditGameForm: {
        title: "Spiel bearbeiten",
        gameTime: "Datum",
        name: "Name",
        spielort: "Spielort",
        optionHalle: "Halle",
        optionDraussen: "Draussen",
        optionSpickelwiese: "Spickelwiese",
        update: "Speichern",
        updating: "Speichere...",
        delete: "Löschen",
        deleting: "Lösche...",
        deleteConfirmation: "Das Spiel wirklich löschen ?",
        gameDeleted: "Das Spiel wurde gelöscht",
        buttons: {
            confirm: "Zusagen",
            decline: "Absagen",
            invite: "Einladung versenden"
        }
    },
    adminSendInvitationForm: {
        title: "Einladung versenden"
    },
    adminChangeStatusForm: {
        title: "Status ändern"
    },
    adminLandingPage: {
        title: "Verwaltung",
        games: "Spiele",
        gamesDescription: "Spiele anlegen, Spiele absagen, usw...",
        users: "Benutzerverwaltung",
        usersDescription: "Berechtigungen und so ein Quatsch",
        server: 'Server',
        teamMatcher: 'Teams bilden',
        serverDescription: 'Servereinstellungen',
        teamMatcherDescription: 'Teams anhand der Ratings zusammenstellen'
    },
    adminOverviewTable: {
        name: "Name",
        email: "E-Mail",
        role: "Rolle",
        playerId: 'ID',
        status: 'Status',
        activeStatus: (active: boolean) => `${active ? 'aktiv' : 'deaktiviert'}`,
        actions: 'Aktionen'
    },
    adminCreateUserForm: {
        title: "Neuen Administrator anlegen",
        name: "Name",
        email: "E-Mail",
        password: "Passwort",
        passwordRepeat: "Passwort (Wiederholung)"
    },
    adminInviteUserForm: {
        title: "Administrator einladen",
        email: "E-Mail",
        name: "Name",
        scope: "Scope",
        validUntil: "Gültig bis"
    },
    adminRatingSelectionForm: {
        included: 'Anwesend',
        allRatings: 'Alle',
        removeAll: 'Alle entfernen'
    },
    game: {
        headings: {
            nextGame: "Nächstes Spiel",
            gameData: "Spieldaten",
            feedback: "Status"
        },
        players: {
            title: "Spieler",
            add: "Hinzufügen"
        },
        count: {
            confirmedPlayers: "Zusagen",
            declinedPlayers: "Absagen",
            undecidedPlayers: "Unentschlossen",
            unknownPlayers: "Unbekannt"
        },
        feedback: {
            headings: {
                defaultFeedback: "Standard Status",
                feedback: "Status",
                playerCount: "Gäste",
                playerCountNotAvailable: "Gäste können nur mitgebracht werden, wenn man selbst kommt ;-)",
                note: "Notiz"
            },
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
        add: "Spieler hinzufügen",
        confirmChange: "Es wurde ein anderer Spieler erkannt! Möchtest du die Spielerzuweisung wechseln?",
        confirmChangeButton: (playerName: string) => `Ja, ich bin eigentlich ${playerName}!`,
        declineChangeButton: (playerName: string) => `Nein, ich möchte ${playerName} bleiben!`
    },
    playerProfileForm: {
        name: "Name",
        email: "E-Mail"
    },
    createPlayerForm: {
        status: "Status",
        name: "Name",
        email: "E-Mail"
    },
    user: {
        roles: {
            admin: "Administratoren",
            player: "Spieler"
        }
    },
    warnings: {
        noToken:
            "Du bist nicht berechtigt einen Status abzusenden oder einen neuen Spieler anzulegen, da du diese Seite ohne einen gültigen Einladungslink besucht hast. Rufe die Seite entweder über einen gültigen Einladungslink auf oder wende dich an einen Administrator.",
        notAuthenticated: "Du hast keine Berechtigung für diese Anwendung. Rufe die Seite entweder über einen gültigen Einladungslink auf oder wende dich an einen Administrator.",
        noPlayer: "Kein Spieler"
    },
    adminGameZusageForm: {
        titleGame: "Zusage für das Spiel am: ",
        titleGameTime: "Spielort: ",
        mailBodyLabel: "Nachricht",
        mailReceiver: "An:",
        sendZusageBtn: "Zusage",
        mailSubjectLabel: "Betreff"
    },
    adminGameAbsageForm: {
        titleGame: "Absage für das Spiel am: ",
        titleGameTime: "Spielort: ",
        mailBodyLabel: "Nachricht",
        mailReceiver: "An:",
        sendAbsageBtn: "Absage",
        mailSubjectLabel: "Betreff"
    },
    adminGameInvitationForm: {
        titleGame: "Einadung für das Spiel am: ",
        invitationLink: "Einladungslink",
        titleGameTime: "Spielort: ",
        mailBodyLabel: "Nachricht",
        mailReceiver: "An:",
        sendInvitationBtn: "Senden",
        mailSubjectLabel: "Betreff",
    },
    deletePlayerForm: {
        confirmationQuestion: (playerName: string) => `Den Spieler "${playerName}" löschen ?`
    },
    deleteGameForm: {
        confirmationQuestion: (gameTime: string) => `Das Spiel am "${gameTime}" löschen ?`
    },
    adminUserDeleteForm: {
        confirmationQuestion: (adminName: string) => `Den Account "${adminName}" löschen?`
    },
    adminInvitationDeleteForm: {
        confirmationQuestion: (adminName: string) => `Die Einladung für "${adminName}" löschen?`
    },
    playerStatusForm: {
        deactivateConfirmationQuestion: (playerName: string) => `Den Spieler "${playerName}" deaktivieren ?`,
        activateConfirmationQuestion: (playerName: string) => `Den Spieler "${playerName}" aktivieren ?`
    },
    playerGreeting: {
        morning: "Guten Morgen",
        noon: "Mahlzeit",
        afternoon: "Guten Nachmittag",
        evening: "Guten Abend"
    },
    adminInvitationOverviewTable: {
        name: "Name",
        email: "E-Mail",
        status: "Status",
        expiresAt: "Gültig bis",

        invitationStatus: (status: AdminInvitationStatus) => {
            switch (status) {
                case "accepted":
                    return "Akzeptiert";
                case "rejected":
                    return "Abgelehnt";
                case "active":
                    return "Wartet auf Antwort";
                default:
                    return "Unbekannt";
            }
        }
    },
    adminInviteUserChoiceForm: {
        title: "Administrator-Einladung",
        email: "E-Mail",
        name: "Name",
        validUntil: "Einladung gültig bis",
        rejectInvitation: "Einladung ablehnen",
        acceptInvitation: "Account anlegen"
    },
    adminInviteUserResponseForm: {
        title: "Neuer Administrator",
        email: "E-Mail",
        name: "Name",
        scope: "Scope",
        validUntil: "Einladung gültig bis",
        password: "Passwort",
        passwordRepeat: "Passwort (Wiederholung)",
        rejectInvitation: "Einladung ablehnen",
        warnings: {
            invalidToken:
                "Du bist nicht berechtigt einen Status abzusenden oder einen neuen Spieler anzulegen, da du diese Seite ohne einen gültigen Einladungslink besucht hast. Rufe die Seite entweder über einen gültigen Einladungslink auf oder wende dich an einen Administrator."
        }
    },
    adminDeleteExpiredForm: {
        confirmationQuestion: (gameCount: number) => `Lösche ${gameCount} ${gameCount > 1 ? "abgelaufene Spiele" : "abgelaufenes Spiel"}? `
    },
    adminEditPlayerForm: {
        title: 'Spieler bearbeiten',
    },
    adminEditFeedbackForm: {
        title: (gameTime: string) => `Rückmeldungen für das Spiel am ${gameTime} anpassen`
    },
    adminPlayerRatingTable: {
        name: 'Name',
        overall: 'Gesamt',
        newRating: 'Neu',
        createPlayerRating: 'Spieler Rating erzeugen',
        addRatingTitle: 'Neues Rating',
        rating: 'Bewertung',
        ratingTechnik: 'Technik',
        ratingSpeed: 'Geschwindigkeit',
        ratingCondition: 'Laufen',
        ratingTotal: 'Gesamt'
    },
};

export default messages;
