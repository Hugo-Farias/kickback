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
      const { settings } = v;

      if (!settings) {
        chrome.storage.local.set({
          [settingsStorageLabel]: defaultSettingsState,
        });
        return;
      }

      if (
        Object.entries(settings).length !==
        Object.entries(defaultSettingsState).length
      ) {
        const defaultArr = Object.keys(defaultSettingsState);
        Object.keys(settings).forEach((v) => {
          if (defaultArr.includes(v)) return;
          delete settings[v];
        });
        chrome.storage.local.set({ [settingsStorageLabel]: settings });
      }
    });
};
