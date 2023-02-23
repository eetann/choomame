import { appearanceOnInstalled } from "../features/appearance/appearance";
import {
  customLinkItemOnInstalled,
  customLinkCollectionOnInstalled,
  updateCustomLinkCollectionOnAlarm,
  setStopBackgroundUpdateCustomLink,
  setStartBackgroundUpdateCustomLink,
  isBackgroundUpdatingCustomLink,
  alarmBackgroundUpdateCustomLink,
} from "../features/customLink/customLink";
import { languagesOnInstalled } from "../features/languages/languages";
import { timesOnInstalled } from "../features/times/times";

chrome.runtime.onInstalled.addListener(async () => {
  await timesOnInstalled();
  await languagesOnInstalled();
  await appearanceOnInstalled();

  await setStartBackgroundUpdateCustomLink();
  await customLinkCollectionOnInstalled();
  await customLinkItemOnInstalled();
  await setStopBackgroundUpdateCustomLink();
  chrome.alarms.create(alarmBackgroundUpdateCustomLink, {
    periodInMinutes: 1440,
  });
});

chrome.runtime.onStartup.addListener(async () => {
  await setStopBackgroundUpdateCustomLink();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === alarmBackgroundUpdateCustomLink) {
    const isUpdating = await isBackgroundUpdatingCustomLink();
    if (isUpdating) {
      return;
    }
    await setStartBackgroundUpdateCustomLink();
    await updateCustomLinkCollectionOnAlarm();
    await setStopBackgroundUpdateCustomLink();
  }
});

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "openPopupForVivaldi":
      chrome.tabs.create({
        url: "popup.html",
      });
      break;
  }
});
