import { ko } from "./ko";
import { en } from "./en";

export const dictionaries = {
  ko,
  en,
};

export type Language = keyof typeof dictionaries;
export type Dictionary = typeof ko;
