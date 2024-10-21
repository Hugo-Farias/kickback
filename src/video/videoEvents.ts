import { getDataFromStorage, storeData, storeTimestamp } from "../helper.ts";
import { StoredStamps, Timestamp } from "../typeDef.ts";
import { currentId, currentVideo } from "./videoObserver.ts";

const intervals: { [key: string]: number } = {};
let seekTimeout: number;

export let data: StoredStamps = getDataFromStorage();

const timeClause = 90;

const fillStamp = (): Timestamp => {
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

  if (
    currentTime < timeClause ||
    currentTime > currentVideo.duration - timeClause
  )
    return null;

  const storedTimestamp = data[currentId] ?? fillStamp();

  data = {
    ...data,
    [currentId]: {
      ...storedTimestamp,
      curr: currentTime,
      total: currentVideo.duration,
    },
  };

  storeTimestamp(data[currentId]);
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

export const onClick = () => {
  if (currentVideo.paused)
    currentVideo.play().catch((e) => console.error("video play:", e));
  else currentVideo.pause();
};

export const resume = () => {
  if (!data[currentId]) {
    currentVideo.currentTime = currentVideo.currentTime - 1;
    return null;
  }
  if (data[currentId].curr < timeClause) {
    delete data[currentId];
    return null;
  }

  data = {
    ...data,
    [currentId]: {
      ...data[currentId],
      storageTime: Date.now(),
    },
  };

  intervals.resume = setInterval(() => {
    clearTimeout(seekTimeout);
    if (currentVideo.currentTime >= timeClause) {
      clearInterval(intervals.resume);
      return null;
    }
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
