import { getIdFromUrl } from "../helper";
import { Message, LocalStamps } from "../typeDef";
import {
  addListenerToVideo,
  deleteTimeStamp,
  getData,
  storeData,
} from "./videoHelper";
import {
  localStorageName,
  maxTimeStamps,
  timeEnd,
  timeoutDuration,
  timeStart,
} from "../config";

console.log("Kickback Running");

let url: string = window.location.href;
export let data: LocalStamps;
export let urlId: string = getIdFromUrl(url); // Current video ID
let videoLength: number = 0;
let isDataFull: boolean;
let isDataOnLookUp: boolean;
let observer: MutationObserver;

const checkData = function () {
  if (isDataFull && isDataOnLookUp) return true;
  if (data.timestamps[urlId]) {
    isDataFull = Object.keys(data.timestamps[urlId]).length >= 5;
    isDataOnLookUp = data.lookup.has(urlId);
  }
};

const clearOldTS = function (obj: LocalStamps) {
  const idsToBeDel = Array.from(obj.lookup).reverse().slice(maxTimeStamps);
  idsToBeDel.forEach((v) => deleteTimeStamp(v, obj));
  storeData(localStorageName, obj);
};

// Wait for video element
function waitForVideo(callback: (video: HTMLVideoElement) => void) {
  if (!url.includes("video")) return;

  observer = new MutationObserver(() => {
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

  setTimeout(() => {
    observer.disconnect(); // Stop the observer after the timeout
  }, timeoutDuration * 1000);
}

// Stores current time to local storage
const storeTime = function (videoEL: HTMLVideoElement) {
  const videoTime = Math.floor(videoEL.currentTime);
  if (videoTime < 10) return;

  // Remove key from storage if time is close to beginning or end of video
  if (videoTime < timeStart || videoTime > videoLength - timeEnd) {
    deleteTimeStamp(urlId, data);
  } else if (!checkData()) {
    data.lookup.add(urlId);
    data.timestamps[urlId] = {
      curr: videoTime,
      total: videoLength,
      title: document.querySelector(".stream-title")?.textContent!.trim(),
      streamer: document
        .querySelector(".stream-username > a")
        ?.textContent!.trim(),
      id: urlId,
    };
    checkData();
  } else {
    data.timestamps[urlId] = { ...data.timestamps[urlId], curr: videoTime };
  }

  storeData(localStorageName, data);
};

// resumes video and sets listeners on play/pause, so it doesn't store it when not needed
const resume = function (videoEl: HTMLVideoElement) {
  const storedTime: number =
    data && data.timestamps[urlId]?.curr ? +data.timestamps[urlId].curr : 0;

  videoLength = Math.floor(videoEl.duration);

  const storeTimeBound = storeTime.bind(videoEl);

  addListenerToVideo("play", storeTimeBound, videoEl);
  addListenerToVideo("pause", storeTimeBound, videoEl, 5);
  addListenerToVideo("seeked", storeTimeBound, videoEl, 2);

  videoEl.currentTime = storedTime;

  if (data.lookup && [...data.lookup].length < maxTimeStamps * 2) return;

  clearOldTS(data);
};

const waitEl = (videoEl: HTMLVideoElement) => resume(videoEl);

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  if (!message.url.includes("video")) return;
  data = getData(localStorageName) as LocalStamps;

  url = message.url;
  urlId = getIdFromUrl(url);
  isDataFull = false;
  isDataOnLookUp = false;
  checkData();
  if (observer) {
    observer.disconnect();
  }

  waitForVideo(waitEl);
});
