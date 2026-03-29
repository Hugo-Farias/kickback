import type { SettingsT, StoredData, Timestamp } from "./types";

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

export const getCacheData = (): StoredData | null => {
  const data = localStorage.getItem("kb2stamps");
  if (!data) return null;
  const parsedData: StoredData = JSON.parse(data);
  return parsedData;
};

export const storeCacheTime = (data: Timestamp, videoId: string) => {
  const fullCache = JSON.parse(
    localStorage.getItem("kb2stamps") || "{}",
  ) as StoredData;

  localStorage.setItem(
    "kb2stamps",
    JSON.stringify({ ...fullCache, [videoId]: data }),
  );
};

export const delFromCache = (id: string) => {
  const fullCache = JSON.parse(
    localStorage.getItem("kb2stamps") || "{}",
  ) as StoredData;
  delete fullCache[id];
  localStorage.setItem("kb2stamps", JSON.stringify(fullCache));
};

export const makeObject = (
  video: HTMLVideoElement,
  time: number,
  videoId: string,
  url: string,
): Timestamp => {
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
