import { getData, storeData } from "../helper.ts";
import { StoredStamps, Timestamp } from "../typeDef.ts";
import { currentId, currentVideo } from "./videoObserver.ts";

const intervals: { [key: string]: number } = {};
let seekTimeout: number;

let data: StoredStamps = getData();

const fillData = (): Timestamp => {
  return {
    curr: currentVideo.currentTime,
    total: currentVideo.duration,
    title: document
      .querySelector(".flex.min-w-0.max-w-full.shrink.gap-1.overflow-hidden")
      ?.textContent?.trim(),
    streamer: document.querySelector("#channel-username")?.textContent?.trim(),
    id: currentId,
    storageTime: Date.now(),
  };
};

const setTime = () => {
  const currentTime = currentVideo.currentTime;

  if (currentTime < 90 || currentTime > currentVideo.duration - 90) return null;

  console.log("setTime");

  const storedTimestamp = data[currentId] ?? fillData();

  data = {
    ...data,
    [currentId]: {
      ...storedTimestamp,
      curr: currentTime,
    },
  };

  storeData(data);
};

export const removeAllIntervalls = () => {
  for (const key of Object.keys(intervals)) {
    clearInterval(intervals[key]);
  }
};

export const onPause = () => {
  clearInterval(intervals.play);
  console.log("pause");
  clearTimeout(seekTimeout);

  seekTimeout = setTimeout(setTime, 2000);
};

export const onPlay = () => {
  clearInterval(intervals.play);

  console.log("play");
  intervals.play = setInterval(setTime, 30000);
};

export const resume = () => {
  if (!data[currentId]) return;

  intervals.first = setInterval(() => {
    clearTimeout(seekTimeout);
    if (currentVideo.currentTime >= 90) {
      clearInterval(intervals.first);
      return null;
    }
    console.log("resume");
    currentVideo.currentTime = data[currentId].curr;
  }, 1000);
};

export const addEvent = (
  element: HTMLVideoElement,
  trigger: keyof HTMLVideoElementEventMap,
  execute: () => void,
) => {
  element.removeEventListener(trigger, execute);
  element.addEventListener(trigger, execute);
};