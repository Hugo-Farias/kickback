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

const fillStamp = (id: string): Timestamp => {
  return {
    curr: currentVideo.currentTime,
    total: currentVideo.duration,
    title: document
      .querySelector(".flex.min-w-0.max-w-full.shrink.gap-1.overflow-hidden")
      ?.textContent?.trim(),
    streamer: document.querySelector("#channel-username")?.textContent?.trim(),
    id: id,
    storageTime: Date.now(),
  };
};

const setTime = () => {
  if (!currentId) return console.log("no id");
  const currentTime = currentVideo.currentTime;

  if (currentTime < timeClause) return null;

  const storedTimestamp = timestamp ?? fillStamp(currentId);

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

const restoreTime = (
  currentVideo: HTMLVideoElement,
  storedTime: number | null,
) => {
  console.log("=>(videoEvents.ts:87) restoreTime");

  if (!storedTime) return null;

  timestamp = {
    ...timestamp,
    storageTime: Date.now(),
  };

  currentVideo.currentTime = storedTime;
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

const onClick = () => {
  console.log("click");
  if (currentVideo.paused)
    currentVideo.play().catch((e) => console.error("video play:", e));
  else currentVideo.pause();
};

export const resumeVideo = (message: MessageType, firstRun: boolean) => {
  removeAllIntervalls();
  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video || !message.id) return null;

    currentId = message.id;
    currentVideo = video;
    timestamp = getDataFromStorage()[message.id];
    console.log(timestamp);

    if (firstRun) {
      addEvent(video, "play", () => {
        console.log("onPlay");
        clearInterval(intervals.play);
        intervals.play = setInterval(setTime, 20000);
      });

      addEvent(video, "seeked", () => {
        console.log("onSeek");
        clearTimeout(seekTimeout);
        seekTimeout = setTimeout(setTime, 2000);
      });

      addEvent(video, "pause", () => {
        console.log("onPause");
        clearInterval(intervals.play);
      });

      if (message.settings.pausePlayClick) {
        addEvent(video, "click", onClick);
      }
    }

    restoreTime(video, timestamp ? timestamp.curr : null);
  });
};
