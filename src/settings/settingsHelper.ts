import { defaultStateT } from "./Settings";
import { settingsStorageLabel } from "../config";
import { defaultSettingsValues } from "./Settings";

export const getSettings = function (name: keyof typeof defaultSettingsValues) {
  return chrome.storage.local
    .get([settingsStorageLabel])
    .then((v: { [key: string]: defaultStateT }) => {
      const setting = v[settingsStorageLabel];
      if (!setting) return defaultSettingsValues[name];
      return setting[name];
    });
};

export const validateStoredSettings = function () {
  chrome.storage.local
    .get([settingsStorageLabel])
    .then((v: { [key: string]: defaultStateT }) => {
      const setting = v[settingsStorageLabel];

      if (!setting) {
        chrome.storage.local
          .set({
            [settingsStorageLabel]: defaultSettingsValues,
          })
          .then();
        return;
      }

      if (
        Object.entries(setting).length !==
        Object.entries(defaultSettingsValues).length
      ) {
        const defaultArr = Object.keys(defaultSettingsValues);
        Object.keys(setting).forEach((v) => {
          if (defaultArr.includes(v)) return null;
          delete setting[v as keyof defaultStateT];
        });
        chrome.storage.local.set({ [settingsStorageLabel]: setting }).then();
      }
    });
};
