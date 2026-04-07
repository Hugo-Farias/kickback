import {
  clog,
  debounce,
  delFromCache,
  getCacheData,
  getSettings,
  getVideoId,
  makeObject,
  storeCacheTime,
  until,
} from "@/helper";
import {
  addNowPlayingTag,
  addProgressBar,
  removeNowPlayingTag,
  removeProgressBar,
} from "@/thumbnailUi";
import type { FullCache, ItemCache, SettingsChanges, SettingsT } from "@/types";
import { initialSettings } from "./popup/Settings";

let lastTimeUpdate = 0;
let firstRun = true;
let timeoutMain: ReturnType<typeof setTimeout>;
let timeoutSaveTime: ReturnType<typeof setTimeout>;
let timeoutRestoreTime: ReturnType<typeof setTimeout>;
let timeoutCloseChat: ReturnType<typeof setTimeout>;
let isChatClosed = false;
let fullData: FullCache | null = null;

const devFunc = (video: HTMLVideoElement) => {
  if (import.meta.env.DEV) {
    setTimeout(() => {
      video.pause();
    }, 4000);
  }
};

const closeChat = (settings: SettingsT) => {
  if (settings?.autoCloseChat) {
    // Close Chat Replay
    clearTimeout(timeoutCloseChat);
    timeoutCloseChat = setTimeout(() => {
      const chatCloseBtn = document.querySelector<HTMLButtonElement>(
        "#channel-chatroom > div > div > button",
      );

      isChatClosed =
        !document.querySelector<HTMLDivElement>("#channel-chatroom")
          ?.offsetWidth;

      if (chatCloseBtn && !isChatClosed) {
        chatCloseBtn.click();
        isChatClosed = true;
      }
    }, 300);
  }
};

const resumeVideo = (
  video: HTMLVideoElement,
  videoId: string,
  videoData: ItemCache,
) => {
  if (!videoId) return;
  const loadedUrl = document.querySelector<HTMLLinkElement>(
    "link[rel='canonical']",
  );
  if (!loadedUrl) return false;
  if (loadedUrl.href !== window.location.href) return false;

  if (videoData) {
    clog("Data found", videoData);
    clog("Resuming video, time:", videoData.curr);
    timeoutRestoreTime = setTimeout(() => {
      lastTimeUpdate = videoData.curr;
      video.currentTime = videoData.curr;
      if (videoData.curr < 30) {
        fullData = delFromCache(videoId);
      }
      if (video.currentTime < 30) return;
    }, 800);
  } else {
    clog("No data");
    lastTimeUpdate = 0;
  }
};

const storeVideoTime = (
  video: HTMLVideoElement,
  videoId: string,
  url: string,
) => {
  const curr = Math.trunc(video.currentTime);

  if (curr < 30) return;
  if (Math.abs(lastTimeUpdate - curr) < 10) return;

  lastTimeUpdate = curr;

  clearTimeout(timeoutSaveTime);

  timeoutSaveTime = setTimeout(() => {
    if (!videoId) return;
    console.log("Storing video time, current time:", curr);
    const newData = makeObject(video, curr, videoId, url);

    fullData = storeCacheTime(newData, videoId);
  }, 2000);
};

const delOldCacheData = (fullData: FullCache, days: number) => {
  const currentTime = Date.now();

  for (const key in fullData) {
    const item = fullData[key];
    if (!item) continue;
    if (currentTime - item.storageTime > 1000 * 60 * 60 * 24 * days) {
      // If data is older than 7 days, delete it
      clog("❌ Deleting old cache data for video ID:", key);
      fullData = delFromCache(key);
    }
  }
};

export default defineContentScript({
  matches: ["*://kick.com/*"],
  runAt: "document_idle",
  main() {
    clog("init 🟢");
    let url = "";
    let streamerPath = window.location.href.split("/")[3];
    let videoId: string | null = "";
    let currentSettings: SettingsT | null = null;
    fullData = getCacheData();

    if (fullData) delOldCacheData(fullData, 180);

    getSettings().then((settings) => {
      if (Object.keys(settings).length) {
        currentSettings = settings;
        closeChat(settings);
        return;
      }
      chrome.storage.local.set(initialSettings);
    });

    window.navigation.addEventListener("navigate", () => {
      clearTimeout(timeoutMain);
      clearTimeout(timeoutSaveTime);
      clearTimeout(timeoutRestoreTime);

      timeoutMain = setTimeout(() => {
        clog("navigation event detected, re-initializing...");
        if (window.location.href === url) {
          removeProgressBar();
          addProgressBar(fullData, streamerPath, currentSettings);
          clog("navigation event detected, but URL is the same, halting...");
          return;
        }

        url = window.location.href;
        videoId = getVideoId(url);
        streamerPath = url.split("/")[3];

        until(() => {
          if (document.readyState !== "complete") return;

          addProgressBar(fullData, streamerPath, currentSettings);
          addNowPlayingTag(currentSettings, videoId);

          if (!videoId) return true;
          const video = document.querySelector<HTMLVideoElement>("video");
          if (!video) return;
          if (video.readyState < 4) return;

          if (!videoId) return;

          const videoData = fullData ? fullData?.[videoId] : null;

          if (videoData && video.currentTime < 30) {
            resumeVideo(video, videoId, videoData);
          }

          devFunc(video);

          if (!firstRun) return true; // Run code bellow ONlY on real full page load

          firstRun = false;

          video.addEventListener("timeupdate", () => {
            if (!videoId) return;
            storeVideoTime(video, videoId, url);
          });

          return true;
        }, 1000);
      }, 500);
    });

    chrome.storage.onChanged.addListener((res: SettingsChanges) => {
      getSettings().then((settings: SettingsT) => {
        currentSettings = settings;
      });

      if (!fullData) return;
      if (!getVideoId(url)) return;

      debounce(() => {
        if (res.showProgressBar?.newValue === false) {
          removeProgressBar();
        } else {
          addProgressBar(fullData, streamerPath, currentSettings);
        }

        if (res.showNowPlayingTag?.newValue === false) {
          removeNowPlayingTag();
        } else {
          addNowPlayingTag(currentSettings, videoId);
        }
      });
    });

    // initial load
    window.navigation.dispatchEvent(new Event("navigate"));
  },
});
