import { defaultStateT } from "./Settings";
import { settingsStorageLabel } from "../config";
import { defaultSettingsValues } from "./Settings";

export const getSettings = function (name: keyof defaultStateT) {
  return chrome.storage.local
    .get([settingsStorageLabel])
    .then(({ settings }: { settings: defaultStateT }) => {
      if (!settings) return defaultSettingsValues[name];
      return settings[name];
    });
};

export const validateStoredSettings = function () {
  chrome.storage.local
    .get([settingsStorageLabel])
    .then(({ settings }: { settings: defaultStateT }) => {
      if (!settings) {
        chrome.storage.local
          .set({
            [settingsStorageLabel]: defaultSettingsValues,
          })
          .then();
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
        chrome.storage.local.set({ [settingsStorageLabel]: settings }).then();
      }
    });
};
