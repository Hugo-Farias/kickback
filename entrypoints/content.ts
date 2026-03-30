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
  removeNowPlayingTag,
  removeProgressBar,
  renderProgressBar,
} from "@/thumbnailUi";
import type { SettingsChanges, SettingsT } from "@/types";
import { initialSettings } from "./popup/App";

const isPageReady = () => {
  const loadedUrl = document.querySelector<HTMLLinkElement>(
    "link[rel='canonical']",
  );
  if (!loadedUrl) return false;
  if (loadedUrl.href !== window.location.href) return false;

  if (document.readyState !== "complete") return false;

  return true;
};

const devFunc = (video: HTMLVideoElement) => {
  setTimeout(() => {
    video.pause();
  }, 4000);
};

let lastTimeUpdate = 0;
let firstRun = true;
let timeoutMain: ReturnType<typeof setTimeout>;
let timeoutSaveTime: ReturnType<typeof setTimeout>;
let timeoutRestoreTime: ReturnType<typeof setTimeout>;
let isChatClosed = false;

export default defineContentScript({
  matches: ["*://kick.com/*"],
  runAt: "document_idle",
  main() {
    let url = "";
    let streamerPath = window.location.href.split("/")[3];
    let videoId: string | null = "";
    let currentSettings: SettingsT | null = null;
    const fullData = getCacheData();

    getSettings().then((s) => {
      if (Object.keys(s).length) {
        currentSettings = s;
        return;
      }
      chrome.storage.local.set(initialSettings);
    });

    // const parsedUrl = new URL(url);
    clog("init 🟢");

    window.navigation.addEventListener("navigate", () => {
      clearTimeout(timeoutMain);
      clearTimeout(timeoutSaveTime);
      clearTimeout(timeoutRestoreTime);

      timeoutMain = setTimeout(() => {
        clog("navigation event detected, re-initializing...");
        if (window.location.href === url) {
          clog("navigation event detected, but URL is the same, halting...");
          return;
        }

        url = window.location.href;
        videoId = getVideoId(url);
        streamerPath = url.split("/")[3];

        if (!videoId) return;
        const data = fullData?.[videoId];

        until(() => {
          if (!isPageReady()) return;

          const video = document.querySelector<HTMLVideoElement>("video");
          if (!video) return;
          if (video.readyState < 4) return;

          renderProgressBar(fullData, streamerPath, currentSettings);

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

          devFunc(video);

          if (currentSettings?.autoCloseChat) {
            // Close Chat Replay
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
          }

          if (!firstRun) return true; // Run code bellow ONlY on real full page load

          firstRun = false;

          video.addEventListener("timeupdate", () => {
            const curr = Math.trunc(video.currentTime);

            if (curr < 30) return;
            if (Math.abs(lastTimeUpdate - curr) < 10) return;

            lastTimeUpdate = curr;

            clearTimeout(timeoutSaveTime);

            timeoutSaveTime = setTimeout(() => {
              clog("Saved", curr, "🟢🟢🟢");
              if (!videoId) return;
              storeCacheTime(makeObject(video, curr, videoId, url), videoId);
            }, 2500);
          });

          return true;
        });
      }, 300);
    });

    chrome.storage.onChanged.addListener((res: SettingsChanges) => {
      getSettings().then((s: SettingsT) => {
        currentSettings = s;
      });

      if (!fullData) return;
      if (!getVideoId(url)) return;

      debounce(() => {
        if (res.showProgressBar?.newValue === false) {
          removeProgressBar();
        }

        if (res.showNowPlayingTag?.newValue === false) {
          removeNowPlayingTag();
        }

        renderProgressBar(fullData, streamerPath, currentSettings);
      });
    });

    // initial load
    window.navigation.dispatchEvent(new Event("navigate"));
  },
});
