import { Message } from "./typeDef";
import { deleteFromObject } from "./helper";

console.log("kickback running");

let url: string = window.location.href;
let urlId: string = url.replace("https://kick.com/video/", ""); // Current url video ID
let storeInterval: number;
let videoLength;
const intervalSecs = 3; // time in between storing current time to local storage in seconds
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
    const videoElement: HTMLVideoElement | null =
      document.querySelector(".vjs-tech");
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
//TODO add a limit of keys allowed in localStorage
//TODO Remove key from storage if time is close to beginning or end of video
const storeTime = function (videoEL: HTMLVideoElement) {
  const videoTime = Math.floor(videoEL.currentTime);
  const storedData = localStorage!.getItem(localStorageTimeStampName);
  const parsedData = storedData !== null ? JSON.parse(storedData) : {};

  console.log("-> videoTime", videoTime);
  console.log("-> videoLength", videoLength);
  console.log("-> parsedData", parsedData);

  if (videoTime < 60 || videoTime > videoLength - 60) {
    deleteFromObject(urlId, parsedData);
    console.log("-> parsedData", parsedData);
    return null;
  }

  parsedData[urlId] = videoTime;

  localStorage.setItem(localStorageTimeStampName, JSON.stringify(parsedData));
};

// resumes video and sets listeners on play/pause, so it doesn't store it when isn't needed
const resume = function (videoEl: HTMLVideoElement) {
  videoLength = Math.floor(videoEl.duration);
  const storage = localStorage.getItem(localStorageTimeStampName);
  const storedTime = storage ? +JSON.parse(storage)[urlId] : null;

  videoEl.currentTime = storedTime ? storedTime : 0;

  videoEl.addEventListener("play", () => onPlay(videoEl));

  videoEl.addEventListener("pause", onPause);
};

// init
waitForVideo((videoEl: HTMLVideoElement) => {
  resume(videoEl);
});

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  if (!message.url.includes("video")) return;

  url = window.location.href;
  urlId = url.replace("https://kick.com/video/", "");
  clearInterval(storeInterval);

  waitForVideo((videoEl: HTMLVideoElement) => {
    resume(videoEl);
  });
});
