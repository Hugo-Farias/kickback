import { Message, LocalStamps, StoredStamps } from "./typeDef";
import {
  convertData,
  deleteTimeStamp,
  getData,
  storeData,
} from "./videoHelper";

console.log("kickback running");

let url: string = window.location.href;
let urlId: string = url.replace("https://kick.com/video/", ""); // Current url video ID
let storeInterval: number;
let videoLength: number = 0;
const timeStart = 60; //time to not store or delete when in range from start
const timeEnd = 240; //time to not store or delete when in range from end
const intervalSecs = 2; // time in between storing current time to local storage in seconds
const maxTimeStamps = 50;
const localStorageName = "kbTimeStamps";

const clearOldTS = function (obj: LocalStamps) {
  const idsToBeDel = Array.from(obj.lookup).reverse().slice(2);
  idsToBeDel.forEach((v) => deleteTimeStamp(v, obj));
  storeData(localStorageName, obj);
};

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
const storeTime = function (videoEL: HTMLVideoElement) {
  const videoTime = Math.floor(videoEL.currentTime);
  const convertedData = getData(localStorageName) as LocalStamps;

  // Remove key from storage if time is close to beginning or end of video
  if (videoTime < timeStart || videoTime > videoLength - timeEnd) {
    deleteTimeStamp(urlId, convertedData);
  } else if (!convertedData.lookup.has(urlId)) {
    convertedData.lookup.add(urlId);
    convertedData.timestamps = {
      [urlId]: videoTime,
      ...convertedData.timestamps,
    };
  } else {
    convertedData.timestamps[urlId] = videoTime;
  }

  storeData(localStorageName, convertedData);
};

// resumes video and sets listeners on play/pause, so it doesn't store it when not needed
const resume = function (videoEl: HTMLVideoElement) {
  const data = getData(localStorageName, false) as StoredStamps;
  const storedTime: number =
    data.timestamps && data.timestamps[urlId] ? +data.timestamps[urlId] : 0;

  videoLength = Math.floor(videoEl.duration);

  videoEl.currentTime = storedTime;

  videoEl.addEventListener("play", () => onPlay(videoEl));

  videoEl.addEventListener("pause", onPause);

  if (data.lookup && data.lookup.length < maxTimeStamps * 2) return;

  clearOldTS(convertData(data));
};

// init
waitForVideo((videoEl: HTMLVideoElement) => {
  resume(videoEl);
});

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  if (!message.url.includes("video")) return;

  url = message.url;
  urlId = url.replace("https://kick.com/video/", "");
  clearInterval(storeInterval);

  waitForVideo((videoEl: HTMLVideoElement) => {
    resume(videoEl);
  });
});
