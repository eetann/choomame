import { Language } from "../features/languages/languagesSlice";
import { Param } from "../features/param/paramSlice";
import { Time } from "../features/times/timesSlice";

export function getLink(
  param: Param,
  time?: Time,
  language?: Language
): string {
  const url = new URL(param.url);
  const new_param = new URLSearchParams();
  new_param.set("q", param.q);
  if (typeof time !== "undefined") {
    if (time.timeId !== "Any") {
      new_param.set("tbs", "qdr:" + time.timeId);
    }
    // time.timeId === "Any" empty
  } else if (param.tbs) {
    new_param.set("tbs", param.tbs);
  }
  // else empty

  if (typeof language !== "undefined") {
    if (language !== "Any") {
      new_param.set("lr", language);
    }
    // language === "Any" empty
  } else if (param.lr) {
    new_param.set("lr", param.lr);
  }
  // else empty

  if (param.tbm) {
    new_param.set("tbm", param.tbm);
  }
  // else empty

  url.search = new_param.toString();
  // Match URL generated when usin the original Google search UI
  return url.toString().replace("&tbs=qdr%3A", "&tbs=qdr:");
}
