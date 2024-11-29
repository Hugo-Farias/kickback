import {
  addEvent,
  getDataFromStorage,
  storeData,
  storeTimestamp,
  waitForElement,
} from "../helper.ts";
import { StoredStamps, Timestamp } from "../typeDef.ts";
import { MessageType } from "../background.ts";

const intervals: { [key: string]: number } = {};
let seekTimeout: number;

export let data: StoredStamps = getDataFromStorage();

let currentId: string | null;

const timeClause = 90;

const fillStamp = (currentVideo: HTMLVideoElement, id: string): Timestamp => {
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

const setTime = (currentVideo: HTMLVideoElement) => {
  if (!currentId) return console.log("no id");
  console.log("setTime", currentId);
  const currentTime = currentVideo.currentTime;

  if (
    currentTime < timeClause ||
    currentTime > currentVideo.duration - timeClause
  )
    return null;

  const storedTimestamp = data[currentId] ?? fillStamp(currentVideo, currentId);

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

export const onClick = (currentVideo: HTMLVideoElement) => {
  console.log("click");
  if (currentVideo.paused)
    currentVideo.play().catch((e) => console.error("video play:", e));
  else currentVideo.pause();
};

export const restoreTime = (
  currentVideo: HTMLVideoElement,
  id: string | null,
) => {
  if (!id) return console.log("no id");
  if (!data[id]) {
    currentVideo.currentTime = currentVideo.currentTime - 1;
    return null;
  }
  if (data[id].curr < timeClause) {
    delete data[id];
    return null;
  }

  data = {
    ...data,
    [id]: {
      ...data[id],
      storageTime: Date.now(),
    },
  };

  intervals.resume = setInterval(() => {
    clearTimeout(seekTimeout);
    if (currentVideo.currentTime >= timeClause) {
      clearInterval(intervals.resume);
      return null;
    }
    currentVideo.currentTime = data[id].curr;
  }, 1000);
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

export const resumeVideo = (message: MessageType, firstRun: boolean) => {
  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video) return null;
    console.log(video.readyState);

    removeAllIntervalls();

    currentId = message.id;

    // init
    restoreTime(video, message.id);

    // Prevent re-run
    if (!firstRun) return null;

    const callSetTime = () => setTime(video);

    addEvent(video, "play", () => {
      console.log("onPlay");
      clearInterval(intervals.play);
      intervals.play = setInterval(callSetTime, 5000);
    });

    addEvent(video, "seeked", () => {
      console.log("onSeek");
      clearTimeout(seekTimeout);
      seekTimeout = setTimeout(callSetTime, 2000);
    });

    addEvent(video, "pause", () => clearInterval(intervals.play));

    if (message.settings.pausePlayClick) {
      addEvent(video, "click", () => onClick(video));
    }

    firstRun = false;
  });
};
