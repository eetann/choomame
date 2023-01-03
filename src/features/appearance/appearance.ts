import { getBucket } from "@extend-chrome/storage";

export type LocationType = "top-right" | "bottom-right";

export type AppearanceBucket = {
  location: LocationType;
};

export const appearanceBucket = getBucket<AppearanceBucket>("appearance");

export const initialAppearanceStorage: AppearanceBucket = {
  location: "top-right",
};

export async function appearanceOnInstalled() {
  const bucket = await appearanceBucket.get();
  if (Object.keys(bucket).length === 0) {
    appearanceBucket.set(initialAppearanceStorage);
  }
}
