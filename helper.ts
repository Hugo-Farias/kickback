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

export const getVideoId = (url: string) => {
  const urlList = url.split("/");
  return urlList[urlList.length - 1];
};

export const getCacheData = (url: string): StoredData[0] | null => {
  const data: StoredData = JSON.parse(localStorage.getItem("kb2stamps") || "");
  if (!data) return null;
  return data[getVideoId(url)];
};

export const storeCacheTime = (data: StoredData[0], url: string) => {
  const fullCache = JSON.parse(
    localStorage.getItem("kb2stamps") || "",
  ) as StoredData;

  const videoId = getVideoId(url);

  localStorage.setItem(
    "kb2stamps",
    JSON.stringify({ ...fullCache, [videoId]: data }),
  );
};

export const makeObject = (
  video: HTMLVideoElement,
  url: string,
): StoredData[0] => {
  const id = getVideoId(url);
  return {
    curr: video.currentTime,
    total: video.duration,
    id: id,
    storageTime: Date.now(),
    streamer:
      document.querySelector("#channel-username")?.textContent.trim() || "",
    title:
      document
        .querySelector("span[data-testid='livestream-title']")
        ?.textContent.trim() || "",
    thumbnailId:
      document
        .querySelector<HTMLImageElement>(`a[href$='${id}'] > div > img`)
        ?.src.match(/video_thumbnails\/([^/]+\/[^/]+)\//)?.[1] || "",
  };
};
