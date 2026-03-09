import type { StoredData } from "./types";

const { log, warn, error } = console;

const logPrefix = "kickback:";

export const clog = (...content: Parameters<typeof log>) => {
  log(logPrefix, ...content);
};

export const elog = (...content: Parameters<typeof error>) => {
  error(logPrefix, ...content);
};

export const wlog = (...content: Parameters<typeof warn>) => {
  warn(logPrefix, ...content);
};

// Wait until the function returns true, then clear the interval
export const until = (fn: () => boolean | undefined, delay = 300) => {
  let count = 0;

  const id = setInterval(() => {
    count++;

    if (count >= 100) {
      clearInterval(id);
      elog("until: function did not return true within the specified attempts");
    }

    if (fn()) {
      clearInterval(id);
      return;
    }
  }, delay);
};

const getVideoId = (url: string) => {
  const urlList = url.split("/");
  return urlList[urlList.length - 1];
};

export const getCacheData = (url: string) => {
  const data: StoredData = JSON.parse(localStorage.getItem("kb2stamps") || "");
  return data[getVideoId(url)];
};
