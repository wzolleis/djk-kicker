import {statusInConfig} from "~/components/i18n/config";

export enum FilterTranslations {
    all = "Alle Spiele",
    current = "Nächstes Spiel"
}

export enum FilterValues {
    all = "all",
    current = "current"
}

export type FilterTranslationsKey = keyof typeof FilterTranslations
export type FilterValuesKey = keyof typeof FilterValues


