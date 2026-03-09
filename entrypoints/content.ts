import { clog, getCacheData, until } from "@/helper";

const isPageReady = () => {
  clog("checking if document is ready...");
  const loadUrl = document.querySelector<HTMLLinkElement>(
    "link[rel='canonical']",
  );
  if (!loadUrl) return false;
  if (loadUrl.href !== window.location.href) return false;

  if (document.readyState !== "complete") return false;

  clog("document is ready ✅");
  return true;
};

const devFunc = (video: HTMLVideoElement) => {
  // video.currentTime = video.duration;

  setTimeout(() => {
    video.pause();
  }, 2000);
};

let lastTimeUpdate = 0;
let firstRun = true;
let timeoutSave: ReturnType<typeof setTimeout>;

export default defineContentScript({
  matches: ["*://kick.com/*"],
  runAt: "document_idle",
  main() {
    console.clear();
    let url = "";
    // const parsedUrl = new URL(url);
    clog("init 🟢");

    window.navigation.addEventListener("navigate", () => {
      setTimeout(() => {
        clog("navigation event detected, re-initializing...");
        if (window.location.href === url) {
          clog("navigation event detected, but URL is the same, halting...");
          return;
        }

        url = window.location.href;

        if (!url.includes("videos/")) return;

        until(() => {
          if (!isPageReady()) return;

          const video = document.querySelector<HTMLVideoElement>("video");
          if (!video) return;

          const data = getCacheData(url);

          if (data) {
            video.currentTime = data.curr;
          }

          // devFunc(video);

          if (!firstRun) return true; // Run code bellow ONlY ONCE

          firstRun = false;

          video.addEventListener("timeupdate", () => {
            const curr = Math.floor(video.currentTime);

            if (curr < 30) return;
            if (Math.abs(lastTimeUpdate - curr) < 10) return;

            lastTimeUpdate = curr;
            // TODO: And make this a function that takes in the data (typed)
            // localStorage.setItem("kb2stamps", JSON.stringify(data));

            clearTimeout(timeoutSave);

            timeoutSave = setTimeout(() => {
              console.log("Saved", Math.floor(video.currentTime), "🟢🟢🟢");
            }, 2000);
          });

          // Close Chat Replay
          const chatCloseBtn = document.querySelector<HTMLButtonElement>(
            "#channel-chatroom > div > div > button",
          );
          if (!chatCloseBtn) return;
          chatCloseBtn.click();

          return true;
        });
      }, 500);
    });

    // initial load
    window.navigation.dispatchEvent(new Event("navigate"));
  },
});
