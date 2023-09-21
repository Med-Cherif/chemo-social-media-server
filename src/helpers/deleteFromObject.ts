import { TObject } from "../types/object";

export default function deleteFromObject(obj: TObject, path: string) {
  let target = obj;

  const keys = path.split(".");

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (target && key in target) {
      target = target[key];
    } else {
      return;
    }
  }

  const lastKey = keys[keys.length - 1];
  if (target && lastKey in target) {
    delete target[lastKey];
  }
}
