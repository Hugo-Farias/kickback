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
import { getIdFromUrl } from "../helper";
import id = chrome.runtime.id;

console.log("video Observer");

let url: string = window.location.href;
let urlId: string = getIdFromUrl(url); // Current url video ID
let videoLength: number = 0;
let isDataFull: boolean;
let isDataOnLookUp: boolean;
let data: LocalStamps;

const checkData = function (): boolean {
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

  setTimeout(() => {
    observer.disconnect(); // Stop the observer after the timeout
  }, timeoutDuration * 1000);
}

// Stores current time to local storage
const storeTime = function (videoEL: HTMLVideoElement) {
  const videoTime = Math.floor(videoEL.currentTime);
  if (videoTime < 10) return;
  // const data = getData(localStorageName) as LocalStamps;
  console.log("-> data", data.timestamps[urlId]);

  // Remove key from storage if time is close to beginning or end of video
  if (videoTime < timeStart || videoTime > videoLength - timeEnd) {
    deleteTimeStamp(urlId, data);
  } else if (!checkData()) {
    console.log("-> isDataFull", isDataFull);
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
  data = getData(localStorageName) as LocalStamps;
  checkData();

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

  url = message.url;
  urlId = getIdFromUrl(url);
  isDataFull = false;
  isDataOnLookUp = false;

  waitForVideo(waitEl);
});
