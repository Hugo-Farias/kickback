import { defaultStateT } from "./Settings";

export const getSettings = async function (name: keyof defaultStateT) {
  return await chrome.storage.local
    .get(["settings"])
    .then((v: { settings: defaultStateT }) => {
      return v.settings[name].value;
    });
};
