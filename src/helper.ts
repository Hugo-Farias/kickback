import { StoredStamps, Timestamp } from "./typeDef.ts";

const storageKey = "kbTimestamps";

type ElementReturnType<T extends Element, L extends boolean> = L extends true
  ? NodeListOf<T> | null
  : T | null;

export const waitForElement = <T extends Element, L extends boolean>(
  selector: string,
  getList: L,
): Promise<ElementReturnType<T, L>> => {
  let timer: number;
  let clearTimer: number;
  let element: NodeListOf<T> | T | null;

  // Wait for element, check for element in 1 second intervals
  return new Promise((resolve) => {
    // console.log('waiting for element "' + selector + '"');

    timer = setInterval(() => {
      if (getList) {
        const temp = document.querySelectorAll<T>(selector);
        if (temp.length > 0) element = temp;
      } else {
        element = document.querySelector<T>(selector);
        // console.log("element =>", element);
      }

      if (element) {
        // console.log(`"${selector}" element found`);
        clearInterval(timer);
        clearTimeout(clearTimer);
        resolve(element as ElementReturnType<T, L>);
      }
    }, 1000);
    // Timeout after 30 seconds
    clearTimer = setTimeout(() => {
      // console.log(`"${selector}" element not found`);
      clearInterval(timer);
      resolve(null);
    }, 30000);
  });
};

export const getIdFromUrl = (url: string) => {
  const urlParts = url.split("/");
  const id = urlParts[urlParts.length - 1];
  if (id.length < 8) return null;
  return id;
};

export const getTimestamp = (id: string | null): Timestamp | null => {
  if (!id) return null;
  const data = localStorage.getItem(storageKey);

  if (!data) return null;

  const parsedData: StoredStamps = JSON.parse(data);

  // Check if id is valid and if it exists return the timestamp else return null
  return parsedData[id] ?? null;
};

export const getData = (): StoredStamps => {
  const data = localStorage.getItem(storageKey);
  if (!data) return {};
  return JSON.parse(data);
};

export const storeData = (data: StoredStamps) => {
  // console.log("storeData");
  localStorage.setItem(storageKey, JSON.stringify(data));
};
