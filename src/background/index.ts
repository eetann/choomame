import { appearanceOnInstalled } from "../features/appearance/appearance";
import {
  customLinksOnInstalled,
  customLinkListOnInstalled,
  updateCustomLinkListonAlarm,
  setStopUpdatingCustomLink,
  setStartUpdatingCustomLink,
  isUpdatingCustomLink,
} from "../features/customLink/customLink";
import { languagesOnInstalled } from "../features/languages/languages";
import { timesOnInstalled } from "../features/times/times";

const alarmCustomLinkListUpdate = "ChoomameCustomLinkListUpdate";

chrome.runtime.onInstalled.addListener(async () => {
  await timesOnInstalled();
  await languagesOnInstalled();
  await appearanceOnInstalled();

  await setStartUpdatingCustomLink();
  await customLinkListOnInstalled();
  await customLinksOnInstalled();
  await setStopUpdatingCustomLink();
  chrome.alarms.create(alarmCustomLinkListUpdate, {
    periodInMinutes: 1440,
  });
});

chrome.runtime.onStartup.addListener(async () => {
  await setStopUpdatingCustomLink();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === alarmCustomLinkListUpdate) {
    const isUpdating = await isUpdatingCustomLink();
    if (isUpdating) {
      return;
    }
    await setStartUpdatingCustomLink();
    await updateCustomLinkListonAlarm();
    await setStopUpdatingCustomLink();
  }
});
