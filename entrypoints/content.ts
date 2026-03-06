import { clog, until } from "@/helper";

const devFunc = (video: HTMLVideoElement) => {
  video.currentTime = video.duration / 2;

  setTimeout(() => {
    video.pause();
  }, 500);

  return true;
};

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
        clog("popstate event detected, re-initializing...");
        if (window.location.href === url) {
          clog("navigate event detected, but URL is the same, ignoring...");
          return;
        }

        clog("URL", url, "=>", window.location.href);

        url = window.location.href;

        if (!url.includes("videos/")) return;

        until(() => {
          clog("checking if document is ready...");
          const loadUrl = document.querySelector<HTMLLinkElement>(
            "link[rel='canonical']",
          );
          if (!loadUrl) return;
          if (loadUrl.href !== url) return;
          if (document.readyState !== "complete") return;

          const video = document.querySelector<HTMLVideoElement>("video");
          if (video?.readyState !== 4) return;

          clog("document is ready ✅");
          devFunc(video);
          return true;
        }, 500);
      }, 500);
    });
  },
});
