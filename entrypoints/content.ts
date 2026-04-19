import {
  checkElement,
  clog,
  debounce,
  delFromCache,
  getCacheData,
  getSettings,
  getVideoId,
  makeObject,
  storeCacheTime,
  until,
  wlog,
} from "@/helper";
import {
  addNowPlayingTag,
  addProgressBar,
  removeNowPlayingTag,
  removeProgressBar,
} from "@/thumbnailUi";
import type { FullCache, ItemCache, SettingsChanges, SettingsT } from "@/types";
import { initialSettings } from "./popup/Settings";

const minSecsForCaching = 60;
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

// TODO: Create function to close sidebar
// TODO: Create function to pause video when clicking inside the video frame

const closeSidebar = (settings: SettingsT) => {
  if (!settings?.autoCloseSidebar) return;

  const sidebarBtn = document.querySelector<HTMLButtonElement>(
    `button[aria-label^='Collapse sidebar']`,
  );

  if (!sidebarBtn) return;
  sidebarBtn.click();
};

const closeChat = (settings: SettingsT) => {
  if (!settings?.autoCloseChat) return;

  // Close Chat Replay
  clearTimeout(timeoutCloseChat);
  timeoutCloseChat = setTimeout(() => {
    const chatCloseBtn = document.querySelector<HTMLButtonElement>(
      "#channel-chatroom > div > div > button",
    );

    isChatClosed =
      !document.querySelector<HTMLDivElement>("#channel-chatroom")?.offsetWidth;

    if (chatCloseBtn && !isChatClosed) {
      chatCloseBtn.click();
      isChatClosed = true;
    }
  }, 300);
};

const resumeVideo = (
  video: HTMLVideoElement,
  videoId: string,
  videoData: ItemCache,
): number | false => {
  if (!videoId) return false;
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
      if (videoData.curr < minSecsForCaching) {
        fullData = delFromCache(videoId);
      }
    }, 800);
  } else {
    clog("No data");
    lastTimeUpdate = 0;
  }

  return video.currentTime;
};

const storeVideoTime = (
  video: HTMLVideoElement,
  videoId: string,
  url: string,
) => {
  const curr = Math.trunc(video.currentTime);

  if (curr < minSecsForCaching) return;
  if (Math.abs(lastTimeUpdate - curr) < 10) return;

  lastTimeUpdate = curr;

  clearTimeout(timeoutSaveTime);

  timeoutSaveTime = setTimeout(() => {
    if (!videoId) return;
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
    let videoId: string | null = getVideoId(window.location.href);
    let currentSettings: SettingsT | null = null;
    fullData = getCacheData();

    if (fullData) delOldCacheData(fullData, 100);

    getSettings().then((settings) => {
      if (Object.keys(settings).length) {
        currentSettings = settings;
        closeChat(settings);
        closeSidebar(settings);
        return;
      }
      chrome.storage.local.set(initialSettings);
    });

    window.navigation.addEventListener("navigate", () => {
      clearTimeout(timeoutMain);
      clearTimeout(timeoutSaveTime);
      clearTimeout(timeoutRestoreTime);

      timeoutMain = setTimeout(() => {
        clog("Navigation event detected, re-initializing...");

        // if (window.location.href === url) {
        //   clog("URL is the same, halting...");
        //   return;
        // }

        removeNowPlayingTag();
        removeProgressBar();

        url = window.location.href;
        videoId = getVideoId(url);
        streamerPath = url.split("/")[3];

        until(() => {
          if (document.readyState !== "complete") return;

          const isProgressBarRendered = checkElement(
            "span",
            "#kb2-progress-bar",
          );

          if (fullData && !isProgressBarRendered) {
            addProgressBar(fullData, streamerPath, currentSettings);
            return false;
          }

          const isTagRendered = checkElement("div", "#kb2-now-playing-tag");

          if (!isTagRendered) {
            addNowPlayingTag(currentSettings);
            return false;
          }

          if (!videoId) return true;

          const video = document.querySelector<HTMLVideoElement>("video");
          if (!video) return;
          if (video.readyState < 2) return;

          if (!videoId) return;

          const videoData = fullData?.[videoId] ?? null;

          if (videoData) {
            const newTime = resumeVideo(video, videoId, videoData);

            if (!newTime) return;

            setTimeout(() => {
              if (newTime < minSecsForCaching) {
                wlog(
                  "Video Data found, but video time has not changed, re-attempting",
                );
                return;
              }
            }, 100);
          }

          devFunc(video);

          if (!firstRun) return true; // Run code bellow ONLY on real full page load

          firstRun = false;

          video.addEventListener("timeupdate", () => {
            if (!videoId) return;
            storeVideoTime(video, videoId, url);
          });

          return true;
        }, 200);
      }, 500);
    });

    chrome.storage.onChanged.addListener((res: SettingsChanges) => {
      getSettings().then((settings: SettingsT) => {
        currentSettings = settings;
      });

      if (!fullData) return;

      debounce(() => {
        if (!currentSettings) return

        if (res.autoCloseChat?.newValue === true) {
            closeChat(currentSettings);
        }

        if (res.autoCloseSidebar?.newValue === true) {
            closeSidebar(currentSettings);
        }

        if (res.showProgressBar?.newValue === false) {
          removeProgressBar();
        } else {
          addProgressBar(fullData, streamerPath, currentSettings);
        }

        if (!videoId) return; // Only run code below when a video is loaded

        if (res.showNowPlayingTag?.newValue === false) {
          removeNowPlayingTag();
        } else {
          addNowPlayingTag(currentSettings);
        }
      });
    });

    // initial load
    window.navigation.dispatchEvent(new Event("navigate"));
  },
});
