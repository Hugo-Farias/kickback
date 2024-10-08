import { getIdFromUrl } from "../helper";
import { Message, LocalStamps } from "../typeDef";
import {
  addListenerToVideo,
  deleteTimeStamp,
  getData,
  storeData,
} from "./videoHelper";
import {
  storageTimestamps,
  maxTimeStamps,
  timeEnd,
  observerTimeoutSecs,
  timeStart,
} from "../config";
// import { getSettings } from "../settings/settingsHelper";

console.log("Kickback Running!");

let url: string = window.location.href;
export let data: LocalStamps;
export let urlId: string = getIdFromUrl(url); // Current video ID
let videoLength = 0;
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
  storeData(storageTimestamps, obj);
};

// Wait for video element
function waitForVideo(callback: (video: HTMLVideoElement) => void) {
  observer = new MutationObserver(() => {
    const videoElement: HTMLVideoElement | null =
      document.querySelector("video");
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
  }, observerTimeoutSecs * 1000);
}

// Stores current time to local storage
const storeTime = function (videoEL: HTMLVideoElement) {
  console.log("store");
  if (videoEL.currentTime < 60) return;
  const videoTime = Math.floor(videoEL.currentTime);

  // Remove key from storage if time is close to beginning or end of video
  if (videoTime < timeStart || videoTime > videoLength - timeEnd) {
    deleteTimeStamp(urlId, data);
  } else if (!checkData()) {
    data.lookup.add(urlId);
    data.timestamps[urlId] = {
      curr: videoTime,
      total: videoLength,
      title: document
        .querySelector(".flex.min-w-0.max-w-full.shrink.gap-1.overflow-hidden")
        ?.textContent?.trim(),
      streamer: document
        .querySelector("#channel-username")
        ?.textContent?.trim(),
      id: urlId,
    };
    checkData();
  } else {
    data.timestamps[urlId] = { ...data.timestamps[urlId], curr: videoTime };
  }

  storeData(storageTimestamps, data);
};

// resumes video and sets listeners on play/pause, so it doesn't store it when not needed
const resume = function (videoEl: HTMLVideoElement) {
  videoLength = Math.floor(videoEl.duration);
  console.log("videoLength =>", videoLength);

  const storedTime: number =
    data && data.timestamps[urlId]?.curr ? +data.timestamps[urlId].curr : 0;

  // getSettings("resume").then((value) => {
  //   if (!value) return;
  addListenerToVideo("play", videoEl, storeTime);
  addListenerToVideo("seeked", videoEl, storeTime, 2);
  addListenerToVideo("pause", videoEl, storeTime, 5);
  videoEl.currentTime = storedTime;
  // });

  if (data.lookup && [...data.lookup].length < maxTimeStamps * 2) return;

  clearOldTS(data);
};

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  url = message.url;
  if ((url.includes("/") && !data) || url.includes("videos")) {
    data = getData(storageTimestamps) as LocalStamps;
  }
  if (!url.includes("videos")) return;

  console.log("message");

  urlId = getIdFromUrl(url);
  isDataFull = false;
  isDataOnLookUp = false;
  checkData();

  if (observer) {
    observer.disconnect();
  }

  waitForVideo((videoEl: HTMLVideoElement) => resume(videoEl));
});
