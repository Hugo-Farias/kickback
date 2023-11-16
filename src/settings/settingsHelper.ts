import { defaultStateT } from "./Settings";
import { settingsStorageLabel } from "../config";

export const getSettings = async function (name: keyof defaultStateT) {
  return await chrome.storage.local
    .get([settingsStorageLabel])
    .then((v: { settings: defaultStateT }) => {
      return v.settings[name].value;
    });
};

export const defaultSettingsValues: defaultStateT = {
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
  uiState: {
    id: "uiState",
    label: "Save state of the chat and recommended sidebar",
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
          [settingsStorageLabel]: defaultSettingsValues,
        });
        return;
      }

      if (
        Object.entries(settings).length !==
        Object.entries(defaultSettingsValues).length
      ) {
        const defaultArr = Object.keys(defaultSettingsValues);
        Object.keys(settings).forEach((v) => {
          if (defaultArr.includes(v)) return;
          delete settings[v];
        });
        chrome.storage.local.set({ [settingsStorageLabel]: settings });
      }
    });
};
