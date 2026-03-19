import {
  clog,
  debounce,
  getCacheData,
  makeObject,
  storeCacheTime,
  until,
} from "@/helper";

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

export default defineContentScript({
  matches: ["*://kick.com/*"],
  runAt: "document_idle",
  main() {
    let url = "";
    // const parsedUrl = new URL(url);
    clog("init 🟢");

    window.navigation.addEventListener("navigate", () => {
      clearTimeout(timeoutMain);
      timeoutMain = setTimeout(() => {
        clog("navigation event detected, re-initializing...");
        if (window.location.href === url) {
          clog("navigation event detected, but URL is the same, halting...");
          return;
        }

        url = window.location.href;

        if (!url.includes("videos/")) return;

        until(() => {
          const video = document.querySelector<HTMLVideoElement>("video");
          if (!video) return;
          if (!isPageReady(video)) return;

          const data = getCacheData(url);

          if (data) {
            clog("Data found", data);
            setTimeout(() => {
              lastTimeUpdate = data.curr;
              video.currentTime = data.curr;
            }, 500);

            if (video.currentTime < 30) return;
          } else {
            clog("No data");
            lastTimeUpdate = 0;
          }

          devFunc(video);

          if (!firstRun) return true; // Run code bellow ONlY ONCE

          firstRun = false;

          video.addEventListener("timeupdate", () => {
            const curr = Math.trunc(video.currentTime);

            if (curr < 30) return;
            if (Math.abs(lastTimeUpdate - curr) < 10) return;

            lastTimeUpdate = curr;

            debounce(() => {
              clog("Saved", Math.trunc(video.currentTime), "🟢🟢🟢");
              storeCacheTime(makeObject(video, url), url);
            }, 3000);
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
      }, 500);
    });

    // initial load
    window.navigation.dispatchEvent(new Event("navigate"));
  },
});
