import {spielortOptions} from "~/helpers/constants/admin.game.constants";
import {gameLocations} from "~/config/locations";
import {AdminInvitationStatus} from "~/config/status";

const messages = {
  app: {
    welcome: "Willkommen bei den DJK Kickern",
    title: "DJK Kicker"
  },
  buttons: {
    edit: "Bearbeiten",
    save: "Speichern",
    back: "Zurück",
    add: "Hinzufügen",
    cancel: "Abbruch",
    delete: "Löschen",
    invite: "Einladen",
    details: "Details"
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
    dashboard: "Dashboard",
    login: "Als Administrator anmelden",
    logout: "Abmelden"
  },
  commonForm: {
    cancel: "Abbruch",
    date: "Datum",
    timeSuggestion: "Zeiten",
    dateSuggestion: "Nächste Termine",
    time: "Uhrzeit",
    year: "Jahr",
    month: "Monat",
    day: "Tag",
    hour: "Stunde",
    minute: "Minuten",
    spielort: (spielortOption: string) =>
      Number.parseInt(spielortOption) === gameLocations.Halle ? messages.adminEditGameForm.optionHalle : messages.adminEditGameForm.optionDraussen,
    gameOverCommentOrNothing: (gameDateIsInThePast: boolean) => (gameDateIsInThePast ? "(Game over)" : "")
  },
  dashboard: {
    nextGame: 'Nächstes Spiel',
    playerAndGuests: 'Spieler und Gäste',
    playerStatusForGame: (gameDate: string) => `Deine Rückmeldung für den  ${gameDate}`,
    playerDefaultStatus: "Dein Standard-Status",
    playerProfile: "Dein Profil",
    playerProfileDescription_1: "Dein Profil enthält Deine Kontaktdaten und Deinen optionalen Standard-Status.",
    playerProfileDescription_2: "Dieser Status wird verwendet, wenn Du keine Rückmeldung für das nächste Spiel setzt und gilt solange, bis Du ihn wieder löscht.",
    saveProfile: "Profil speichern",
    showProfile: "Profil anzeigen",
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
  errors: {
    noGame: "Kein Spiel vorhanden"
  },
  adminGamesTable: {
    name: "Spielname",
    gametime: "Zeit",
    location: "Spielort"
  },
  adminGamesForm: {
    name: "Name",
    new: "Neues Spiel",
    deleteExpired: "Spiele löschen"
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
    usersDescription: "Berechtigungen und so ein Quatsch"
  },
  adminOverviewTable: {
    name: "Name",
    email: "E-Mail",
    role: "Rolle"
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
  game: {
    headings: {
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
    notAuthenticated: "Du hast keine Berechtigung für diese Anwendung. Rufe die Seite entweder über einen gültigen Einladungslink auf oder wende dich an einen Administrator."
  },
  adminGameZusageForm: {
    titleGame: "Zusage für das Spiel am: ",
    titleGameTime: "Spielort: ",
    mailBodyLabel: "Nachricht",
    mailReceiver: "An:",
    sendZusageBtn: "Zusage",
    spielort: (optionValue: string) => `${Number.parseInt(optionValue) === spielortOptions.halle.value ? "in der Halle" : "draußen"}`,
    mailSubjectLabel: "Betreff"
  },
  adminGameAbsageForm: {
    titleGame: "Absage für das Spiel am: ",
    titleGameTime: "Spielort: ",
    mailBodyLabel: "Nachricht",
    mailReceiver: "An:",
    sendAbsageBtn: "Absage",
    spielort: (optionValue: string) => `${Number.parseInt(optionValue) === spielortOptions.halle.value ? "in der Halle" : "draußen"}`,
    mailSubjectLabel: "Betreff"
  },
  adminGameInvitationForm: {
    titleGame: "Einadung für das Spiel am: ",
    invitationLink: "Einladungslink",
    titleGameTime: "Spielort: ",
    mailBodyLabel: "Nachricht",
    mailReceiver: "An:",
    sendInvitationBtn: "Senden",
    spielort: (optionValue: string) => `${Number.parseInt(optionValue) === spielortOptions.halle.value ? "in der Halle" : "draußen"}`,
    mailSubjectLabel: "Betreff",
    mailBody: (datum: string) => `Hallo Spieler
Einladung für das Spiel am ${datum}.
Spielort: Halle/Draußen 

Bitte klicke auf die Einladung und teile uns mit, ob Du kommen kannst.
Verwende den Link bitte auch, wenn Du Deine Entscheidung nochmal ändern möchtest.

Vielen Dank 
`
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
  }
};

export default messages;
