import { Message, Timestamp } from "../typeDef.ts";
import {
  addEvent,
  getTimestamp,
  removeAllIntervalls,
  waitForElement,
} from "../helper.ts";

const intervals: { [key: string]: number } = {};

const resume = (videoElement: HTMLVideoElement, time: number) => {
  videoElement.currentTime = time;
};

// const onPlay = (id: string, time: number) => {
//   console.log("play");
//   intervals.play = setInterval(() => {
//     setTime(id, time);
//   }, 1000 * 10);
//   console.log(intervals);
// };

const fillData = (video: HTMLVideoElement, id: string): Timestamp => {
  return {
    curr: video.currentTime,
    total: video.duration,
    title: document
      .querySelector(".flex.min-w-0.max-w-full.shrink.gap-1.overflow-hidden")
      ?.textContent?.trim(),
    streamer: document.querySelector("#channel-username")?.textContent?.trim(),
    id: id,
    storageTime: Date.now(),
  };
};

const storeData = (
  video: HTMLVideoElement,
  id: string,
  data: Timestamp | null,
) => {
  console.log("play");
  if (video.currentTime < 60) return null;

  const dataToStore = data ?? fillData(video, id); //
  console.log(dataToStore);

  clearInterval(intervals.play);
  intervals.play = setInterval(() => {
    console.log("interval");
  }, 1000);
};

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  removeAllIntervalls(intervals);
  if (!message.id) return null;
  const id = message.id;

  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video) return console.error("Video element not found");

    const data: Timestamp | null = getTimestamp(id);

    // console.log(data);

    // run storeData
    // storeData(video, id, data);

    // Set intervals on play
    addEvent(video, "play", storeData.bind(null, video, id, data));

    // Clear intervals on pause
    addEvent(video, "pause", () => removeAllIntervalls(intervals));

    // video.addEventListener("pause", () => {
    //   clearInterval(intervals.play);
    // });

    video.pause();
    video.play();

    if (!data) return null;

    resume(video, data.curr);
  });
});
