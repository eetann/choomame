import { appearanceOnInstalled } from "../features/appearance/appearanceSlice";
import {
  customLinkItemsOnInstalled,
  customLinkListOnInstalled,
} from "../features/customLink/customLink";
import { languagesOnInstalled } from "../features/languages/languages";
import { timesOnInstalled } from "../features/times/times";

chrome.runtime.onInstalled.addListener(async () => {
  await timesOnInstalled();
  await languagesOnInstalled();
  await appearanceOnInstalled();
  await customLinkListOnInstalled();
  await customLinkItemsOnInstalled();
});
