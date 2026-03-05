import { clog, until } from "@/helper";

const devFunc = (video: HTMLVideoElement) => {
  video.currentTime = video.duration / 2;

  setTimeout(() => {
    clog("video is paused ✅");
    video.pause();
  }, 2000);

  return true;
};

export default defineContentScript({
  matches: ["*://kick.com/*"],
  runAt: "document_idle",
  main() {
    const url = window.location.href;
    if (!url.includes("videos/")) return;
    const parsedUrl = new URL(url);
    clog("init 🟢");

    until(() => {
      if (document.readyState !== "complete") return;
      const video = document.querySelector<HTMLVideoElement>("video");
      if (video?.readyState !== 4) return;

      clog("document is ready ✅");
      devFunc(video);
      return true;
    }, 100);
  },
});
