import { StoredStamps, Timestamp } from "./typeDef.ts";

const storageKey = "dummy";

export const waitForElement = <T extends Element>(
  selector: string,
): Promise<T | null> => {
  // Wait for video, check for element in 1 second intervals
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      const element = document.querySelector<T>(selector);
      if (element) {
        clearInterval(timer);
        resolve(element);
      }
    }, 1000);
    // Timeout after 30 seconds
    setTimeout(() => {
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
  localStorage.setItem(storageKey, JSON.stringify(data));
};
