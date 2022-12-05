import {getNextGameDay, validateEmail} from "./utils";
import dateUtils from "~/dateUtils";

describe('utils', () => {
  describe('emails', () => {
    test("validateEmail returns false for non-emails", () => {
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("not-an-email")).toBe(false);
      expect(validateEmail("n@")).toBe(false);
    });

    test("validateEmail returns true for emails", () => {
      expect(validateEmail("kody@example.com")).toBe(true);
    });
  })
  describe('time calculation', function () {
    test("given actual date is before wednesday then next Game Day is in same week", () => {
      const startDate = dateUtils.dateTimeFromFormat({text: "04.12.2022 20:00"})
      const nextGameDay = getNextGameDay(startDate)
      console.log('next game', dateUtils.dateTimeToFormat({value: nextGameDay}))
      expect(nextGameDay.day).toBe(7)
      expect(nextGameDay.month).toBe(12)
      expect(nextGameDay.year).toBe(2022)
    })

    test("given actual day is after wednesday then next Game Day is in next week", () => {
      const startDate = dateUtils.dateTimeFromFormat({text: "08.12.2022 20:00"})
      const nextGameDay = getNextGameDay(startDate)
      console.log('next game', dateUtils.dateTimeToFormat({value: nextGameDay}))
      expect(nextGameDay.day).toBe(14)
      expect(nextGameDay.month).toBe(12)
      expect(nextGameDay.year).toBe(2022)
    })

    test("given actual date is 'game day' when next game day is calculated, then calculated date is the actual date", () => {
      const startDate = dateUtils.dateTimeFromFormat({text: "07.12.2022 20:00"})
      const nextGameDay = getNextGameDay(startDate)
      console.log('next game', dateUtils.dateTimeToFormat({value: nextGameDay}))
      expect(nextGameDay.day).toBe(7)
      expect(nextGameDay.month).toBe(12)
      expect(nextGameDay.year).toBe(2022)
    })
  });

})

