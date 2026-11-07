import type en from "../../messages/en.json";
import type { Locale } from "./i18n";

/** Shape of the UI strings. hi.json and gu.json must match en.json or this file fails to type-check. */
export type Messages = typeof en;

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  en: () => import("../../messages/en.json").then((m) => m.default),
  hi: () => import("../../messages/hi.json").then((m) => m.default),
  gu: () => import("../../messages/gu.json").then((m) => m.default),
};

export function getMessages(locale: Locale): Promise<Messages> {
  return dictionaries[locale]();
}
