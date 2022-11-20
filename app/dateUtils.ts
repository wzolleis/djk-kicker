import { DateTime } from "luxon";

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

export default {
  format,
  parse,
  now
};