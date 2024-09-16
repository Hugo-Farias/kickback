import { getData, storeData } from "../helper.ts";
import { StoredStamps, Timestamp } from "../typeDef.ts";
import { currentId, currentVideo } from "./videoObserver.ts";

const intervals: { [key: string]: number } = {};
const data: StoredStamps = getData();

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

const setTime = (time: number): Timestamp => {
  const storedTimestamp = data[currentId];

  if (!storedTimestamp) return fillData();

  return {
    ...storedTimestamp,
    curr: time,
  };
};

export const removeAllIntervalls = () => {
  for (const key of Object.keys(intervals)) {
    clearInterval(intervals[key]);
  }
};

const checkTime = () => {
  return (
    currentVideo.currentTime < 90 ||
    currentVideo.currentTime > data[currentId].total - 90
  );
};

export const onPause = () => {
  removeAllIntervalls();
};

export const onPlay = () => {
  removeAllIntervalls();

  intervals.play = setInterval(() => {
    if (checkTime()) return null;

    console.log("interval");
    const newData: StoredStamps = {
      ...data,
      [currentId]: setTime(currentVideo.currentTime),
    };

    storeData(newData);
  }, 5000);
};

export const addEvent = (
  element: HTMLVideoElement,
  trigger: keyof HTMLVideoElementEventMap,
  execute: () => void,
) => {
  element.removeEventListener(trigger, execute);
  element.addEventListener(trigger, execute);
};
