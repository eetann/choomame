import { appearanceOnInstalled } from "../features/appearance/appearance";
import {
  customLinksOnInstalled,
  customLinkListOnInstalled,
} from "../features/customLink/customLink";
import { languagesOnInstalled } from "../features/languages/languages";
import { timesOnInstalled } from "../features/times/times";

const alarmCustomLinkListUpdate = "ChoomameCustomLinkListUpdate";

chrome.runtime.onInstalled.addListener(async () => {
  await timesOnInstalled();
  await languagesOnInstalled();
  await appearanceOnInstalled();
  await customLinkListOnInstalled();
  await customLinksOnInstalled();
  chrome.alarms.create(alarmCustomLinkListUpdate, {
    periodInMinutes: 1440,
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === alarmCustomLinkListUpdate) {
    console.log("TODO: ここでupdate");
  }
});
