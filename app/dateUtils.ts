import {DateTime} from "luxon";

const format = (date: Date | undefined,
                options: { format: string } = { format: "dd.MM.yyyy HH:mm" }): string => {
  if (!date) return 'undefined'
  return DateTime.fromJSDate(date).toFormat(options.format);
};

const parse = (text: string | null | undefined): Date | undefined => {
  if (!text) return undefined;
  return DateTime.fromFormat(text, "dd.MM.yyyy HH:mm").toJSDate();
};

const now = () => DateTime.now().toJSDate();

const dateTimeToFormat = ({value, options} : {value: DateTime, options?: {format: string}}): string => {
  return value.toFormat(options?.format ?? "dd.MM.yyyy HH:mm" )
}

const dateTimeFromFormat = ({text, options} : {text: string, options?: {format: string}}): DateTime => {
  return DateTime.fromFormat(text, options?.format ?? "dd.MM.yyyy HH:mm" )
}

export default {
  format,
  parse,
  now,
  dateTimeFromFormat,
  dateTimeToFormat
};