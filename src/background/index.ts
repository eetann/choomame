import { timesOnInstalled } from "../features/times/timesSlice";
import { languagesOnInstalled } from "../features/languages/languagesSlice";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
    timesOnInstalled();
    languagesOnInstalled();
  }
});
