import type { FullCache, ItemCache, SettingsT } from "./types";

const { log, error } = console;

const logPrefix = "KickResume:";

const capitalize = (str: Parameters<typeof log>[0]) => {
  if (!str) return str;

  if (typeof str !== "string") return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const clog = (...content: Parameters<typeof log>) => {
  log(logPrefix, ...content.map((val) => capitalize(val)));
};

export const elog = (...content: Parameters<typeof error>) => {
  error(logPrefix, ...content);
};

export const getSettings = (): Promise<SettingsT> => {
  return new Promise((resolve) => {
    chrome.storage.local.get((items: SettingsT) => {
      resolve(items);
    });
  });
};

let debounceTimeout: ReturnType<typeof setTimeout>;

// Debounce funciton
export const debounce = (callback: () => void, delay: number = 300) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    callback();
  }, delay);
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

export const getVideoId = (url: string): string | null => {
  const urlList = url.split("/");
  if (urlList[4] !== "videos") return null;
  const id = urlList[5];
  if (!id) return null;
  return id;
};

export const getCacheData = (): FullCache | null => {
  const data = localStorage.getItem("kb2stamps");
  if (!data) return null;
  const parsedData: FullCache = JSON.parse(data);
  return parsedData;
};

export const storeCacheTime = (data: ItemCache, videoId: string) => {
  const fullCache = getCacheData() || {};

  localStorage.setItem(
    "kb2stamps",
    JSON.stringify({ ...fullCache, [videoId]: data }),
  );

  return { ...fullCache, [videoId]: data };
};

export const delFromCache = (id: string) => {
  const fullCache = JSON.parse(
    localStorage.getItem("kb2stamps") || "{}",
  ) as FullCache;
  delete fullCache[id];
  localStorage.setItem("kb2stamps", JSON.stringify(fullCache));
  return fullCache;
};

export const makeObject = (
  video: HTMLVideoElement,
  time: number,
  videoId: string,
  url: string,
): ItemCache => {
  return {
    curr: time,
    total: video.duration,
    id: videoId || "",
    storageTime: Date.now(),
    streamer:
      document.querySelector("#channel-username")?.textContent.trim() || "",
    title:
      document
        .querySelector("span[data-testid='livestream-title']")
        ?.textContent.trim() || "",
    thumbnailId:
      document
        .querySelector<HTMLImageElement>(`a[href$='${videoId}'] > div > img`)
        ?.src.match(/video_thumbnails\/([^/]+\/[^/]+)\//)?.[1] || "",
    streamerPath: url.split("/")[3] || "",
  };
};
