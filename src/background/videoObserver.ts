import { Message, Timestamp } from "../typeDef.ts";
import { getTimestamp, waitForElement } from "../helper.ts";
import {
  addEvent,
  removeAllIntervalls,
  onPlay,
  onPause,
} from "./videoEvents.ts";

const resume = (videoElement: HTMLVideoElement, time: number) => {
  videoElement.currentTime = time;
};

// const fillData = (video: HTMLVideoElement, id: string): Timestamp => {
//   return {
//     curr: video.currentTime,
//     total: video.duration,
//     title: document
//       .querySelector(".flex.min-w-0.max-w-full.shrink.gap-1.overflow-hidden")
//       ?.textContent?.trim(),
//     streamer: document.querySelector("#channel-username")?.textContent?.trim(),
//     id: id,
//     storageTime: Date.now(),
//   };
// };

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  removeAllIntervalls();
  if (!message.id) return null;
  const id = message.id;

  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video) return console.error("Video element not found");

    const data: Timestamp | null = getTimestamp(id);

    // console.log(data);

    // run storeData
    // storeData(video, id, data);

    // Set intervals on play
    addEvent(video, "play", onPlay);

    // Clear intervals on pause
    addEvent(video, "pause", onPause);

    // video.addEventListener("pause", () => {
    //   clearInterval(intervals.play);
    // });

    video.pause();
    video.play().then(null);

    if (!data) return null;

    resume(video, data.curr);
  });
});
