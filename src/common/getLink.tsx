import { Language } from "../features/languages/languagesSlice";
import { joinTbs, Param, ParamTbs } from "../features/param/paramSlice";
import { Time } from "../features/times/timesSlice";

export function getLink(
  param: Param,
  time?: Time,
  language?: Language
): string {
  const url = new URL(param.url);
  const new_param = new URLSearchParams();
  new_param.set("q", param.q);

  // Time
  const newTbs: ParamTbs = {};
  Object.assign(newTbs, param.tbs);
  if (typeof time !== "undefined") {
    if (time.timeId === "Any") {
      delete newTbs.qdr;
    } else {
      let newQdr = time.timeId;
      if (time.number === 1) {
        newQdr = time.timeId.charAt(0);
      }
      newTbs.qdr = newQdr;
    }
    delete newTbs.cdr;
    delete newTbs.cd_min;
    delete newTbs.cd_max;
  }
  if (Object.keys(newTbs).length !== 0) {
    new_param.set("tbs", joinTbs(newTbs));
  }

  // Language
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
