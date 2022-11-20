import {DateTime} from "luxon";

export class AdminTokenOptions {
    username: string;
    email: string
    scope: Array<string>;
    expires_at: DateTime

    constructor(username: string, email: string, scope: Array<string>, expires_at: DateTime) {
        this.username = username;
        this.email = email;
        this.scope = scope;
        this.expires_at = expires_at;
    }
}