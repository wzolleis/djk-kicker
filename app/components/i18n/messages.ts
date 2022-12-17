import {spielortOptions} from "~/helpers/constants/admin.game.constants";
import {gameLocations} from "~/config/locations";
import {AdminInvitationStatus} from "~/config/status";

const messages = {
  app: {
    welcome: "Willkommen bei den DJK Kickern",
    title: "DJK Kicker",
  },
  buttons: {
    edit: "Bearbeiten",
    save: "Speichern",
    back: "Zurück",
    add: "Hinzufügen",
    cancel: "Abbruch",
    delete: "Löschen",
    invite: "Einladen",
  },
  actionType: {
    GAME_INVITATION: "Einladung",
    GAME_ZUSAGE: "Zusage",
    GAME_ABSAGE: "Absage",
  },
  appmenu: {
    administration: "Verwaltung",
    gameadministration: "Spieleverwaltung",
    useradministration: "Benutzerverwaltung",
    games: "Alle Spiele",
    login: "Anmelden",
    logout: "Abmelden",
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
    gameOverCommentOrNothing: (gameDateIsInThePast: boolean) => (gameDateIsInThePast ? "(Game over)" : ""),
  },
  loginform: {
    welcome: "DJK Kicker - Anmeldung",
    description: "Viel Spaß beim Bolzen",
    email: "Email",
    password: "Passwort",
    login: "Anmelden",
    rememberMe: "Anmeldedaten speichern",
    createAccount: "Neuen Account anlegen",
  },
  joinForm: {
    backToLogin: "Zur Anmeldung",
    createAccount: "Neuen Account anlegen",
  },
  adminGamesTable: {
    name: "Spielname",
    gametime: "Zeit",
    location: "Spielort",
  },
  adminGamesForm: {
    name: "Name",
    new: "Neues Spiel",
  },
  adminUsersForm: {
    invitations: "Einladungen",
  },
  adminGameActionsForm: {
    title: "Verlauf",
    noActions: "Es wurden noch keine Aktionen ausgeführt",
  },
  adminCreateGameForm: {
    newGame: "Neues Spiel anlegen",
    gameTime: "Datum",
    name: "Name",
    submit: "Speichern",
    submitting: "Speichere...",
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
      invite: "Einladung versenden",
    },
  },
  adminSendInvitationForm: {
    title: "Einladung versenden",
  },
  adminChangeStatusForm: {
    title: "Status ändern",
  },
  adminLandingPage: {
    title: "Verwaltung",
    games: "Spiele",
    gamesDescription: "Spiele anlegen, Spiele absagen, usw...",
    users: "Benutzerverwaltung",
    usersDescription: "Berechtigungen und so ein Quatsch",
  },
  adminOverviewTable: {
    name: "Name",
    email: "E-Mail",
    role: "Rolle",
  },

  adminInvitationOverviewTable: {
    name: "Name",
    email: "E-Mail",
    status: "Status",
    expiresAt: "Gültig bis",

    invitationStatus: (status: AdminInvitationStatus) => {
      switch (status) {
        case "accepted": return 'Akzeptiert'
        case "rejected": return 'Abgelehnt'
        case "active": return 'Wartet auf Antwort'
        default: return 'Unbekannt'
      }
    }
  },
  adminCreateUserForm: {
    name: "Name",
    email: "E-Mail",
    password: "Passwort",
    passwordRepeat: "Passwort (Wiederholung)",
  },
  adminInviteUserForm: {
    title: "Administrator einladen",
    email: "E-Mail",
    name: "Name",
    scope: "Scope",
    validUntil: "Gültig bis",
    },
    adminInviteUserChoiceForm: {
        title: 'Administrator-Einladung',
        email: 'E-Mail',
        name: 'Name',
        validUntil: 'Einladung gültig bis',
        rejectInvitation: 'Einladung ablehnen',
        acceptInvitation: 'Account anlegen',
    },
    adminInviteUserResponseForm: {
        title: 'Neuer Administrator',
        email: 'E-Mail',
        name: 'Name',
        scope: 'Scope',
        validUntil: 'Einladung gültig bis',
        password: 'Passwort',
        passwordRepeat: 'Passwort (Wiederholung)',
        rejectInvitation: 'Einladung ablehnen',
        warnings: {
            invalidToken: "Du bist nicht berechtigt einen Status abzusenden oder einen neuen Spieler anzulegen, da du diese Seite ohne einen gültigen Einladungslink besucht hast. Rufe die Seite entweder über einen gültigen Einladungslink auf oder wende dich an einen Administrator."
        },
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
      unknownPlayers: "Unbekannt",
    },
    feedback: {
      status: {
        translations: {
          unknown: "Unbekannt",
          declined: "Abgesagt",
          confirmed: "Zugesagt",
          undecided: "Unsicher",
        },
      },
    },
    add: "Spiel hinzufügen",
    filters: {
      all: "Alle Spiele",
      current: "Nächstes Spiel",
      values: {
        all: "all",
        current: "current",
      },
    },
  },
  player: {
    add: "Spieler hinzufügen",
  },
  createPlayerForm: {
    status: "Status",
    name: "Name",
    email: "E-Mail",
  },
  user: {
    roles: {
      admin: "Administratoren",
      player: "Spieler",
    },
  },
  warnings: {
    noToken:
      "Du bist nicht berechtigt einen Status abzusenden oder einen neuen Spieler anzulegen, da du diese Seite ohne einen gültigen Einladungslink besucht hast. Rufe die Seite entweder über einen gültigen Einladungslink auf oder wende dich an einen Administrator.",
  },
  adminGameZusageForm: {
    titleGame: "Zusage für das Spiel am: ",
    titleGameTime: "Spielort: ",
    mailBodyLabel: "Nachricht",
    mailReceiver: "An:",
    sendZusageBtn: "Zusage",
    spielort: (optionValue: string) => `${Number.parseInt(optionValue) === spielortOptions.halle.value ? "in der Halle" : "draußen"}`,
  },
  adminGameAbsageForm: {
    titleGame: "Absage für das Spiel am: ",
    titleGameTime: "Spielort: ",
    mailBodyLabel: "Nachricht",
    mailReceiver: "An:",
    sendAbsageBtn: "Absage",
    spielort: (optionValue: string) => `${Number.parseInt(optionValue) === spielortOptions.halle.value ? "in der Halle" : "draußen"}`,
    mailSubjectLabel: "Betreff",
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
  },
  playerGreeting: {
    morning: "Guten Morgen",
    noon: "Mahlzeit",
    afternoon: "Guten Nachmittag",
    evening: "Guten Abend",
  },
};

export default messages;
