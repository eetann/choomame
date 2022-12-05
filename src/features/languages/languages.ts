import { getBucket } from "@extend-chrome/storage";
import { initialLanguagesStorage, Language, LanguagesBucket } from "./languagesSchema";

export const languagesBucket = getBucket<LanguagesBucket>("languages");

export async function languagesOnInstalled() {
  const bucket = await languagesBucket.get();
  if (Object.keys(bucket).length === 0) {
    languagesBucket.set(initialLanguagesStorage);
  }
}

export async function getLanguages(): Promise<Language[]> {
  const bucket = await languagesBucket.get();
  return bucket.languages;
}
