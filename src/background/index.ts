import { languagesOnInstalled } from "../features/languages/languagesSlice";
import { timesOnInstalled } from "../features/times/timesSlice";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
    timesOnInstalled();
    languagesOnInstalled();
  }
});
