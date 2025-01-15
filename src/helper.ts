import { oldStamps, StoredStamps, Timestamp } from "./typeDef.ts";
import { SettingsValuesT } from "./background.ts";

const storageKey = "kb2stamps";
const oldKey = "kbTimestamps";

type ElementReturnType<
  T extends Element,
  L extends boolean = false,
> = L extends true ? NodeListOf<T> : T;

export const waitForElement = <
  T extends ElementReturnType<Element>,
  L extends boolean = false,
>(
  selector: string,
  getList: L | boolean = false,
  checkforVideoId = false,
): Promise<ElementReturnType<T, L> | null> => {
  let timer: number;
  let clearTimer: number;
  let element: NodeListOf<T> | T | null;
  let videoId: string | null;

  // Wait for element, check for element in 1 second intervals
  return new Promise((resolve) => {
    clearInterval(timer);
    clearTimeout(clearTimer);

    timer = setInterval(() => {
      console.log("waiting for ", selector);
      if (getList) {
        element = document.querySelectorAll<T>(selector);
      } else {
        element = document.querySelector<T>(selector);
      }

      if (checkforVideoId) {
        const linkElement: HTMLLinkElement | null = document.querySelector(
          'link[rel="canonical"]',
        );
        if (linkElement) {
          videoId = linkElement.href;
          console.log(videoId);
          console.log(location.href);
        }
      }

      if (element && (checkforVideoId ? videoId === location.href : true)) {
        clearInterval(timer);
        clearTimeout(clearTimer);
        resolve(element as ElementReturnType<T, L>);
      }
    }, 500);

    // Timeout after n seconds
    clearTimer = setTimeout(() => {
      clearInterval(timer);
      resolve(null);
    }, 10000);
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
