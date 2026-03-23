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
    // video.currentTime = 100;
  }, 4000);

  // Close Chat Replay
  const chatCloseBtn = document.querySelector<HTMLButtonElement>(
    "#channel-chatroom > div > div > button",
  );

  isChatClosed =
    !document.querySelector<HTMLDivElement>("#channel-chatroom")?.offsetWidth;

  if (chatCloseBtn && !isChatClosed) {
    chatCloseBtn.click();
    isChatClosed = true;
  }
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
    let videoId: string | null = "";
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
        const streamerPath = url.split("/")[3];

        const fullData = getCacheData();
        if (!videoId) return;
        const data = fullData?.[videoId];

        until(() => {
          if (!isPageReady()) return;

          renderProgressBar(fullData, streamerPath);

          const video = document.querySelector<HTMLVideoElement>("video");
          if (!video) return;
          if (video.readyState < 4) return;

          if (data) {
            clog("Data found", data);
            timeoutRestoreTime = setTimeout(() => {
              lastTimeUpdate = data.curr;
              video.currentTime = data.curr;
              if (!videoId) return;
              if (data.curr < 30) delFromCache(videoId);
              console.log("video.currentTime ==>", video.currentTime);
              if (video.currentTime < 30) return;
            }, 800);
          } else {
            clog("No data");
            lastTimeUpdate = 0;
          }

          devFunc(video);

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

          return true;
        });
      }, 300);
    });

    // initial load
    window.navigation.dispatchEvent(new Event("navigate"));
  },
});
