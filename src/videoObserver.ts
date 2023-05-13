import { Message } from "./typeDef";

console.log("observer running");

// Wait for video element
function waitForVideo(
  callback: (video: HTMLVideoElement, urlId: string) => void
) {
  const url = window.location.href;
  if (!url.includes("video")) return;
  const observer = new MutationObserver(() => {
    const videoElement = document.querySelector("video");
    if (videoElement && videoElement.readyState >= 3) {
      observer.disconnect();
      callback(videoElement);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

// function to be called when video available
const resume = function (videoEl: HTMLVideoElement) {
  videoEl.currentTime = 1500;
};

waitForVideo((videoEl) => {
  resume(videoEl);
});

chrome.runtime.onMessage.addListener((message: Message) => {
  if (!message.url.includes("video")) return;

  waitForVideo((videoEl) => {
    resume(videoEl);
  });
});
