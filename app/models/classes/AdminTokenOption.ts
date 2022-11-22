import {DateTime} from "luxon";

export class AdminTokenOptions {
    preferred_username: string;
    email: string
    scope: string
    expires_at: DateTime

    constructor(username: string, email: string, scope: string, expires_at: DateTime) {
        this.preferred_username = username;
        this.email = email;
        this.scope = scope;
        this.expires_at = expires_at;
    }
}