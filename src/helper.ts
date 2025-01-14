import { oldStamps, StoredStamps, Timestamp } from "./typeDef.ts";
import { SettingsValuesT } from "./background.ts";

const storageKey = "kb2stamps";
const oldKey = "kbTimestamps";

type ElementReturnType<
  T extends Element,
  L extends boolean = false,
> = L extends true ? NodeListOf<T> : T;

export const waitForElement = <T extends Element, L extends boolean = false>(
  selector: string,
  getList: L | boolean = false,
): Promise<ElementReturnType<T, L> | null> => {
  let timer: number;
  let clearTimer: number;
  let element: NodeListOf<T> | T | null;

  // Wait for element, check for element in 1 second intervals
  return new Promise((resolve) => {
    clearInterval(timer);
    clearTimeout(clearTimer);
    timer = setInterval(() => {
      if (getList) {
        const temp = document.querySelectorAll<T>(selector);
        if (temp.length > 0) element = temp;
      } else {
        element = document.querySelector<T>(selector);
      }

      if (element) {
        clearInterval(timer);
        clearTimeout(clearTimer);
        resolve(element as ElementReturnType<T, L>);
      }
    }, 1000);
    // Timeout after 30 seconds
    clearTimer = setTimeout(() => {
      clearInterval(timer);
      resolve(null);
    }, 3000);
  });
};

export const addEvent = (
  element: HTMLElement,
  trigger: keyof HTMLVideoElementEventMap,
  execute: () => void,
) => {
  // element.removeEventListener(trigger, execute);
  element.addEventListener(trigger, execute);
};

export const getIdFromUrl = (url: string) => {
  const urlParts = url.split("/");
  if (!urlParts[urlParts.length - 2].includes("videos")) return null;
  return urlParts[urlParts.length - 1];
};

export const getDataFromStorage = (): StoredStamps => {
  const data = localStorage.getItem(storageKey);

  if (!data) {
    const oldData: string | null = localStorage.getItem(oldKey);
    if (oldData) {
      const oldObj: oldStamps = JSON.parse(oldData);
      return oldObj.timestamps;
    }
    return {};
  }

  localStorage.removeItem(oldKey);

  return JSON.parse(data);
};

export const storeTimestamp = (data: Timestamp) => {
  localStorage.setItem(
    storageKey,
    JSON.stringify({ ...getDataFromStorage(), [data.id]: data }),
  );
};

export const storeData = (data: StoredStamps) => {
  localStorage.setItem(storageKey, JSON.stringify(data));
};

const settingsStorageLabel = "settings";

export const getSettings = (): Promise<SettingsValuesT> => {
  return Promise.resolve(
    chrome.storage.local
      .get([settingsStorageLabel])
      .then((value) => value[settingsStorageLabel]),
  );
};
