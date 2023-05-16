import { LocalTimeStamps, Message, StoredTimeStamps } from "./typeDef";
import { convertData, deleteTimeStamp, storeData } from "./videoHelper";

console.log("kickback running");

let url: string = window.location.href;
let urlId: string = url.replace("https://kick.com/video/", ""); // Current url video ID
let storeInterval: number;
let videoLength: number = 0;
const timeStart = 60; //time to not store or delete when in range from start
const timeEnd = 120; //time to not store or delete when in range from end
const intervalSecs = 20; // time in between storing current time to local storage in seconds
const maxTimeStamps = 100;
const localStorageTimeStampName = "kbTimeStamps";

const clearOldTS = function (obj: StoredTimeStamps) {
  const idsToBeDel = Array.from(obj.lookup)
    .reverse()
    .slice(Math.floor(maxTimeStamps / 2));
  idsToBeDel.forEach((v) => deleteTimeStamp(v, obj));
  storeData(localStorageTimeStampName, obj);
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
  const data = localStorage!.getItem(localStorageTimeStampName);
  const parsedData =
    data !== null ? JSON.parse(data) : { timestamps: {}, lookup: [] };

  const convertedData: StoredTimeStamps = convertData(parsedData);

  // Remove key from storage if time is close to beginning or end of video
  if (videoTime < timeStart || videoTime > videoLength - timeEnd) {
    deleteTimeStamp(urlId, convertedData);
  } else if (!convertedData.lookup.has(urlId)) {
    convertedData.lookup.add(urlId);
    console.log("-> convertedData.timestamps", convertedData.timestamps);
    convertedData.timestamps = {
      [urlId]: videoTime,
      ...convertedData.timestamps,
    };
  } else {
    convertedData.timestamps[urlId] = videoTime;
  }

  storeData(localStorageTimeStampName, convertedData);
};

// resumes video and sets listeners on play/pause, so it doesn't store it when not needed
const resume = function (videoEl: HTMLVideoElement) {
  const storage: string | null = localStorage.getItem(
    localStorageTimeStampName
  );
  const parsedStorage: LocalTimeStamps = storage ? JSON.parse(storage) : {};
  const storedTime =
    parsedStorage.timestamps && parsedStorage.timestamps[urlId]
      ? +parsedStorage.timestamps[urlId]
      : 0;

  videoLength = Math.floor(videoEl.duration);

  videoEl.currentTime = storedTime;

  videoEl.addEventListener("play", () => onPlay(videoEl));

  videoEl.addEventListener("pause", onPause);

  if (parsedStorage.lookup && parsedStorage.lookup.length < maxTimeStamps)
    return;

  clearOldTS(convertData(parsedStorage));
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
