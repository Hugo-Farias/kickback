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
import type { SettingsChanges, SettingsT, StoredData } from "@/types";
import { initialSettings } from "./popup/App";

let lastTimeUpdate = 0;
let firstRun = true;
let timeoutMain: ReturnType<typeof setTimeout>;
let timeoutSaveTime: ReturnType<typeof setTimeout>;
let timeoutRestoreTime: ReturnType<typeof setTimeout>;
let timeoutCloseChat: ReturnType<typeof setTimeout>;
let isChatClosed = false;
let fullData: StoredData | null = null;

const devFunc = (video: HTMLVideoElement) => {
  setTimeout(() => {
    video.pause();
  }, 4000);
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
  data: StoredData[0],
) => {
  const loadedUrl = document.querySelector<HTMLLinkElement>(
    "link[rel='canonical']",
  );
  if (!loadedUrl) return false;
  if (loadedUrl.href !== window.location.href) return false;

  if (data) {
    clog("Data found", data);
    timeoutRestoreTime = setTimeout(() => {
      lastTimeUpdate = data.curr;
      video.currentTime = data.curr;
      if (!videoId) return;
      if (data.curr < 30) delFromCache(videoId);
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

// TODO: Add function to check for cache age and delete if it's too old
export default defineContentScript({
  matches: ["*://kick.com/*"],
  runAt: "document_idle",
  main() {
    let url = "";
    let streamerPath = window.location.href.split("/")[3];
    let videoId: string | null = "";
    let currentSettings: SettingsT | null = null;
    fullData = getCacheData();

    clog("init 🟢");

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

      fullData = getCacheData();

      timeoutMain = setTimeout(() => {
        clog("navigation event detected, re-initializing...");
        if (window.location.href === url) {
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

          const data = fullData ? fullData?.[videoId] : null;

          if (data && video.currentTime > 30) return;

          if (data) {
            resumeVideo(video, videoId, data);
          }

          devFunc(video);

          if (!firstRun) return true; // Run code bellow ONlY on real full page load

          firstRun = false;

          video.addEventListener("timeupdate", () => {
            // biome-ignore lint/style/noNonNullAssertion: videoId can't be null here
            storeVideoTime(video, videoId!, url);
          });

          return true;
        });
      }, 100);
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
