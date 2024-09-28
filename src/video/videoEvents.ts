import { getData, storeData } from "../helper.ts";
import { StoredStamps, Timestamp } from "../typeDef.ts";
import DUMMY_DATA from "../data/DUMMY_DATA.json";
import { currentId, currentVideo } from "./videoObserver.ts";

const intervals: { [key: string]: number } = {};
let seekTimeout: number;

const dummy = DUMMY_DATA;

console.log(dummy);

storeData(dummy);

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
};

export const onPlay = () => {
  clearInterval(intervals.play);

  intervals.play = setInterval(setTime, 20000);
};

export const onSeek = () => {
  clearTimeout(seekTimeout);
  seekTimeout = setTimeout(setTime, 2000);
};

export const resume = () => {
  if (!data[currentId]) return;

  intervals.first = setInterval(() => {
    clearTimeout(seekTimeout);
    if (currentVideo.currentTime >= 90) {
      clearInterval(intervals.first);
      return null;
    }
    currentVideo.currentTime = data[currentId].curr;
  }, 100);
};

export const addEvent = (
  element: HTMLVideoElement,
  trigger: keyof HTMLVideoElementEventMap,
  execute: () => void,
) => {
  element.removeEventListener(trigger, execute);
  element.addEventListener(trigger, execute);
};

const dataOverLimit = (limit: number) => {
  const output = Object.keys(data).length;
  // console.log(output);
  return limit <= output;
};

export const deleteOldFromData = (amount: number) => {
  if (!dataOverLimit(amount)) return null;

  const keys = Object.keys(data).sort(
    (a, b) => data[a].storageTime - data[b].storageTime,
  );

  console.log(keys);
  for (let i = 0; i < amount / 2; i++) {
    delete data[keys[i]];
    // console.log(data[keys[i]]);
  }
  console.log(data);

  // storeData(data);
};
