import { TObject } from "../types/object";

export default function accessNestedObject(obj: TObject = {}, key = ""): any {
  const keys = key.split(".");

  let target = obj;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (target && k in target) {
      target = target[k];
    } else {
      return null;
    }
  }

  return target;
}
