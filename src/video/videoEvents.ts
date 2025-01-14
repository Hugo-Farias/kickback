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

let data: StoredStamps;

let currentVideo: HTMLVideoElement;
let currentId: string | null;

// Time in seconds before resuming video is allowed
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
  console.log("setTime Atempt");
  if (!currentId) return console.log("no id");
  const currentTime = currentVideo.currentTime;

  if (currentTime < timeClause) return null;

  const storedTimestamp = data[currentId] ?? fillStamp(currentId);

  data = {
    ...data,
    [currentId]: {
      ...storedTimestamp,
      curr: currentTime,
      total: currentVideo.duration,
    },
  };

  console.log("setTime", data);

  storeTimestamp(data[currentId]);
};
export const removeAllIntervalls = () => {
  for (const key of Object.keys(intervals)) {
    clearInterval(intervals[key]);
  }
};

const onClick = () => {
  console.log("click");
  if (currentVideo.paused)
    currentVideo.play().catch((e) => console.error("video play:", e));
  else currentVideo.pause();
};

const restoreTime = (currentVideo: HTMLVideoElement, id: string | null) => {
  if (!id) return console.log("no id");
  currentVideo.pause();
  if (!data[id]) {
    console.log("no data");
    currentVideo.currentTime = currentVideo.currentTime++;
    currentVideo.play().then();
    return null;
  }

  data = {
    ...data,
    [id]: {
      ...data[id],
      storageTime: Date.now(),
    },
  };

  console.log(data);

  intervals.resume = setInterval(() => {
    clearTimeout(seekTimeout);
    if (currentVideo.currentTime >= timeClause) {
      clearInterval(intervals.resume);
      return null;
    }
    currentVideo.currentTime = data[id].curr;
    currentVideo.play().then();
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
    data = getDataFromStorage();

    currentVideo = video;
    currentId = message.id;
    console.log(currentId);

    if (firstRun) {
      console.log("first run");
      addEvent(video, "play", () => {
        console.log("onPlay");
        clearInterval(intervals.play);
        intervals.play = setInterval(setTime, 2000);
      });

      addEvent(video, "seeked", () => {
        console.log("onSeek");
        clearTimeout(seekTimeout);
        seekTimeout = setTimeout(setTime, 2000);
      });

      addEvent(video, "pause", () => clearInterval(intervals.play));

      if (message.settings.settingsPausePlayClick) {
        addEvent(video, "click", onClick);
      }
    }

    restoreTime(video, message.id);
  });
};
