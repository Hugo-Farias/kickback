import {
  addEvent,
  getDataFromStorage,
  storeData,
  storeTimestamp,
  waitForElement,
} from "../helper.ts";
import { Timestamp } from "../typeDef.ts";
import { MessageType } from "../background.ts";

const intervals: { [key: string]: number } = {};
let seekTimeout: number;

let timestamp: Timestamp;

let currentVideo: HTMLVideoElement;
let currentId: string | null;

// Time in seconds before saving video time is allowed
const timeClause = 90;

const fillStamp = (videoEl: HTMLVideoElement, id: string): Timestamp => {
  return {
    curr: videoEl.currentTime,
    total: videoEl.duration,
    title: document
      .querySelector(".flex.min-w-0.max-w-full.shrink.gap-1.overflow-hidden")
      ?.textContent?.trim(),
    streamer: document.querySelector("#channel-username")?.textContent?.trim(),
    id: id,
    storageTime: Date.now(),
  };
};

const setTime = () => {
  if (!currentId) return null;
  // console.log("setTime called");
  const currentTime = currentVideo.currentTime;

  if (currentTime < timeClause) return null;
  // console.log("stored");

  const storedTimestamp = timestamp ?? fillStamp(currentVideo, currentId);

  timestamp = {
    ...storedTimestamp,
    curr: currentTime,
    total: currentVideo.duration,
  };

  storeTimestamp(timestamp);
};

const removeAllIntervalls = () => {
  clearTimeout(seekTimeout);
  for (const key of Object.keys(intervals)) {
    clearInterval(intervals[key]);
  }
};

const restoreTime = (currentVideo: HTMLVideoElement, storedTime: number) => {
  timestamp = {
    ...timestamp,
    storageTime: Date.now(),
  };

  currentVideo.currentTime = storedTime;
  // console.log(currentVideo.currentTime, storedTime);
  return null;
};

const onPlay = () => {
  // console.log("onPlay");
  clearInterval(intervals.play);
  intervals.play = setInterval(setTime, 10000);
};

const onSeeked = function () {
  // console.log("onSeek");
  clearTimeout(seekTimeout);
  seekTimeout = setTimeout(setTime, 2000);
};

const onPause = () => {
  // console.log("onPause");
  clearInterval(intervals.play);
};

const onClick = (videoEl: HTMLVideoElement) => {
  // console.log("click");
  if (videoEl.paused) return null;
  videoEl.pause();
};

export const resumeVideo = (message: MessageType, firstRun: boolean) => {
  if (currentId === message.id) return null; // Prevents running multiple instances on the same page
  currentId = message.id;

  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video) return null;

    if (message.settings.pausePlayClick && firstRun) {
      addEvent(video, "click", onClick.bind(null, video));
    }
    if (!message.id) return null;

    if (location.href.split("/")[4] !== "videos") return null;

    removeAllIntervalls();
    currentVideo = video;
    timestamp = getDataFromStorage()[message.id];
    // console.log(self.document);

    addEvent(video, "play", onPlay);

    addEvent(video, "seeked", onSeeked);

    addEvent(video, "pause", onPause);

    if (!timestamp) {
      // this is so the eventListeners trigger without user interaction on page first load
      video.currentTime = video.currentTime + 0.1;
      return null;
    }

    restoreTime(video, timestamp.curr);
  });
};

export const deleteOldFromData = (amount: number) => {
  const localData = getDataFromStorage();
  const dataKeys = Object.keys(localData);

  if (dataKeys.length < amount * 2) return null;

  const keys = dataKeys
    .sort((a, b) => localData[b].storageTime - localData[a].storageTime)
    .reverse();

  for (let i = 0; i < Math.ceil(amount); i++) {
    delete localData[keys[i]];
  }

  storeData(localData);
};

// type VideoQualityT = "160" | "360" | "480" | "720" | "1080" | "0";
//
// export const forceVideoQuality = (videoQuality: VideoQualityT) => {
//   // console.log(document.querySelector('div[id^="radix-:"]').textContent);
//
//   document.cookie = `stream_quality_cookie=${videoQuality}; path=/;`;
// };
