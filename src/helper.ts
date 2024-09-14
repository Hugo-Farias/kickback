import { StoredStamps, Timestamp } from "./typeDef.ts";

export const waitForElement = <T extends Element>(
  selector: string,
): Promise<T | null> => {
  // Wait for video element every 1 second
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      console.log("search");
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

export const getData = (id?: string): StoredStamps | Timestamp | null => {
  const data = localStorage.getItem("kbTimeStamps");

  if (!data) return null;

  const parsedData = JSON.parse(data) as StoredStamps;

  // Check if id is valid and if it exists return the timestamp
  if (id && parsedData.timestamps[id]) {
    return parsedData.timestamps[id] as unknown as Timestamp;
  }

  return parsedData;
};
