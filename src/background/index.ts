import { timesOnInstalled } from "../features/time/timeSlice";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
    timesOnInstalled();
  }
});
