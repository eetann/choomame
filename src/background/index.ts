import { appearanceOnInstalled } from "../features/appearance/appearanceSlice";
import { languagesOnInstalled } from "../features/languages/languages";
import { timesOnInstalled } from "../features/times/times";

chrome.runtime.onInstalled.addListener(async () => {
  await timesOnInstalled();
  await languagesOnInstalled();
  await appearanceOnInstalled();
});
