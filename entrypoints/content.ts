import { clog, until } from "@/helper";

const devFunc = (video: HTMLVideoElement) => {
  video.currentTime = video.duration / 2;

  setTimeout(() => {
    video.pause();
  }, 3000);

  return true;
};

export default defineContentScript({
  matches: ["*://kick.com/*"],
  runAt: "document_idle",
  main() {
    console.clear();
    const url = window.location.href;
    if (!url.includes("videos/")) return;
    // const parsedUrl = new URL(url);
    clog("init 🟢");

    // TODO: Find a way to detect url changes
    window.navigation.addEventListener("navigate", () => {
      setTimeout(() => {
        clog("popstate event detected, re-initializing...");
        clog("URL", url);
        clog("window.location.href ==>", window.location.href);
      }, 500);
    });

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
  },
});
