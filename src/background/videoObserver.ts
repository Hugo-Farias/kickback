import { Message, LocalStamps, StoredStamps } from "../typeDef";
import {
  addListenerToVideo,
  convertData,
  deleteTimeStamp,
  getData,
  storeData,
} from "./videoHelper";
import {
  intervalSecs,
  localStorageName,
  maxTimeStamps,
  timeEnd,
  timeoutDuration,
  timeStart,
} from "../config";
import { getIdFromUrl } from "../helper";

console.log("videoObserver running");

let url: string = window.location.href;
let urlId: string = getIdFromUrl(url); // Current url video ID
// let storeInterval: number;
// let storeTimeout: number;
let videoLength: number = 0;
// let seekTimeout: number;
// let listenerTimeout: number;

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
  const data = getData(localStorageName) as LocalStamps;

  console.log("-> videoTime store", videoTime);

  // Remove key from storage if time is close to beginning or end of video
  if (videoTime > videoLength - timeEnd) {
    console.log("delete");
    deleteTimeStamp(urlId, data);
  } else if (!data.lookup.has(urlId)) {
    data.lookup.add(urlId);
    data.timestamps[urlId] = {
      curr: videoTime,
      total: videoLength,
      title: document.querySelector(".stream-title")?.textContent!.trim(),
      streamer: document
        .querySelector(".stream-username > span")
        ?.textContent!.trim(),
      id: urlId,
    };
  } else {
    data.timestamps[urlId] = { ...data.timestamps[urlId], curr: videoTime };
  }

  storeData(localStorageName, data);
};

// resumes video and sets listeners on play/pause, so it doesn't store it when not needed
const resume = function (videoEl: HTMLVideoElement) {
  if (!url.includes("video")) return;

  const data = getData(localStorageName, false) as StoredStamps;
  const storedTime: number =
    data && data.timestamps[urlId]?.curr ? +data.timestamps[urlId].curr : 0;

  videoLength = Math.floor(videoEl.duration);

  addListenerToVideo("play", storeTime.bind(this, videoEl), videoEl);
  addListenerToVideo("pause", storeTime.bind(this, videoEl), videoEl, 5);
  addListenerToVideo("seeked", storeTime.bind(this, videoEl), videoEl, 2);

  videoEl.currentTime = storedTime;

  if (data.lookup && data.lookup.length < maxTimeStamps * 2) return;

  clearOldTS(convertData(data));
};

const waitEl = (videoEl: HTMLVideoElement) => resume(videoEl);

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  if (!message.url.includes("video")) return;
  console.log("update");

  url = message.url;
  urlId = getIdFromUrl(url);

  waitForVideo(waitEl);
});
