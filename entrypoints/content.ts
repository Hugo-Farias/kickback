import {
  clog,
  delFromCache,
  getCacheData,
  getVideoId,
  makeObject,
  storeCacheTime,
  until,
} from "@/helper";
import { renderProgressBar } from "@/thumbnailUi";

const isPageReady = (video: HTMLVideoElement) => {
  clog("checking if document is ready...");
  if (!video) return false;
  if (video.readyState < 4) return false;

  const loadedUrl = document.querySelector<HTMLLinkElement>(
    "link[rel='canonical']",
  );
  if (!loadedUrl) return false;
  if (loadedUrl.href !== window.location.href) return false;

  if (document.readyState !== "complete") return false;

  clog("document is ready ✅");
  return true;
};

const devFunc = (video: HTMLVideoElement) => {
  setTimeout(() => {
    video.pause();
    // video.currentTime = 100;
  }, 4000);
};

let lastTimeUpdate = 0;
let firstRun = true;
let timeoutMain: ReturnType<typeof setTimeout>;
let timeoutSaveTime: ReturnType<typeof setTimeout>;

export default defineContentScript({
  matches: ["*://kick.com/*"],
  runAt: "document_idle",
  main() {
    let url = "";
    let videoId: string | null = "";
    // const parsedUrl = new URL(url);
    clog("init 🟢");

    window.navigation.addEventListener("navigate", () => {
      clearTimeout(timeoutMain);
      clearTimeout(timeoutSaveTime);

      timeoutMain = setTimeout(() => {
        clog("navigation event detected, re-initializing...");
        if (window.location.href === url) {
          clog("navigation event detected, but URL is the same, halting...");
          return;
        }

        url = window.location.href;
        videoId = getVideoId(url);
        const streamerPath = url.split("/")[3];

        const fullData = getCacheData();
        if (!videoId) return;
        const data = fullData?.[videoId];

        until(() => {
          const video = document.querySelector<HTMLVideoElement>("video");
          if (!videoId) return;
          if (!video) return;
          if (!isPageReady(video)) return;

          renderProgressBar(fullData, streamerPath);

          if (data) {
            clog("Data found", data);
            lastTimeUpdate = data.curr;
            video.currentTime = data.curr;
            if (data.curr < 30) delFromCache(videoId);
            if (video.currentTime < 30) return;
          } else {
            clog("No data");
            lastTimeUpdate = 0;
          }

          devFunc(video);

          // Render Progress Bar

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
            }, 3500);
          });

          // Close Chat Replay
          const chatCloseBtn = document.querySelector<HTMLButtonElement>(
            "#channel-chatroom > div > div > button",
          );

          if (chatCloseBtn) {
            chatCloseBtn.click();
          }

          return true;
        });
      }, 1000);
    });

    // initial load
    window.navigation.dispatchEvent(new Event("navigate"));
  },
});
