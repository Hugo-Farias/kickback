import { Message } from "./typeDef";

console.log("kickback running");

let url: string = window.location.href;
let urlId: string = url.replace("https://kick.com/video/", ""); // Current url video ID
let testVideo: HTMLVideoElement;
let storeInterval;
const intervalSecs = 10; // time in between storing current time to local storage in seconds
const localStorageTimeStampName = "kbTimeStamps";

const onPlay = function (videoEl: HTMLVideoElement) {
  clearInterval(storeInterval);
  storeInterval = setInterval(() => storeTime(videoEl), intervalSecs * 1000);
};

const onPause = function () {
  clearInterval(storeInterval);
};

// Wait for video element
function waitForVideo(callback: (video: HTMLVideoElement) => void) {
  if (!url.includes("video")) return;

  const observer = new MutationObserver(() => {
    const videoElement: HTMLVideoElement = document.querySelector(".vjs-tech");
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

// Stores current time to local storage
const storeTime = function (videoEL: HTMLVideoElement) {
  const videoTime = Math.floor(videoEL.currentTime).toString();
  const storage =
    JSON.parse(localStorage.getItem(localStorageTimeStampName)) || {};

  storage[urlId] = videoTime;
  console.log("-> storage", storage);

  localStorage.setItem(localStorageTimeStampName, JSON.stringify(storage));
};

// resumes video and sets listeners on play/pause, so it doesn't store it when isn't needed
const resume = function (videoEl) {
  const storage = localStorage.getItem(localStorageTimeStampName);
  const storedTime = +JSON.parse(storage)[urlId];

  // const videoEl = document.querySelector("video");

  console.log("-> storedTime", storedTime);

  videoEl.currentTime = storedTime ? storedTime : 0;

  videoEl.addEventListener("play", onPlay.bind(this, videoEl));

  videoEl.addEventListener("pause", onPause);
};

// wait for video to be playing to store timestamp on interval remove interval on pause
// const storeListeners = function (videoEl: HTMLVideoElement) {
//   clearInterval(storeInterval);
//
//   videoEl.addEventListener("play", () => {
//     console.log("play");
//     storeInterval = setInterval(() => storeTime(videoEl), intervalSecs * 1000);
//   });
//
//   videoEl.addEventListener("pause", () => {
//     console.log("pause");
//     clearInterval(storeInterval);
//   });
// };

// init
waitForVideo((videoEl) => {
  resume(videoEl);
  testVideo = videoEl;
});

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  if (!message.url.includes("video")) return;

  url = window.location.href;
  urlId = url.replace("https://kick.com/video/", "");
  clearInterval(storeInterval);

  // testVideo.removeEventListener("play", onPlay);
  // testVideo.removeEventListener("pause", onPause);

  waitForVideo((videoEl) => {
    resume(videoEl);
    testVideo = videoEl;
  });
});
