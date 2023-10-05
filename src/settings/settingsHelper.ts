import { defaultStateT } from "./Settings";
import { settingsStorageLabel } from "../config";

export const getSettings = async function (name: keyof defaultStateT) {
  return await chrome.storage.local
    .get([settingsStorageLabel])
    .then((v: { settings: defaultStateT }) => {
      return v.settings[name].value;
    });
};

export const defaultSettingsState: defaultStateT = {
  resume: {
    id: "resume",
    label: "Resume VODs",
    type: "checkbox",
    value: true,
  },
  progressBar: {
    id: "progressBar",
    label: "Show progress bar on thumbnail previews",
    type: "checkbox",
    value: true,
  },
};

export const validateStoredSettings = function () {
  chrome.storage.local
    .get([settingsStorageLabel])
    .then((v: { settings: defaultStateT }) => {
      const set = v.settings;

      if (!set) {
        chrome.storage.local.set({
          [settingsStorageLabel]: defaultSettingsState,
        });
      }
    });
};
