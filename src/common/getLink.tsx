import { Param } from "../features/param/paramSlice";
export function getLink(param: Param) {
  let link = param.qLink;
  if (param.tbs) {
    link += "&tbs=" + param.tbs;
  }
  if (param.lr) {
    link += "&lr=" + param.lr;
  }
  if (param.tbm) {
    link += "&tbm=" + param.tbm;
  }
  return link;
}
