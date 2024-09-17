import { Message, Timestamp } from "../typeDef.ts";
import { getTimestamp, waitForElement } from "../helper.ts";
import {
  addEvent,
  removeAllIntervalls,
  onPlay,
  onPause,
} from "./videoEvents.ts";

export let currentId: string;
export let currentVideo: HTMLVideoElement;

const resume = (videoElement: HTMLVideoElement, time: number) => {
  videoElement.currentTime = time;
};

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  removeAllIntervalls();
  if (!message.id) return null;
  currentId = message.id;

  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video) return console.error("Video element not found");
    currentVideo = video;

    const timestamp: Timestamp | null = getTimestamp(currentId);

    // Set intervals on play
    addEvent(video, "play", onPlay);

    // Clear intervals on pause
    addEvent(video, "pause", onPause);

    if (!timestamp) {
      console.log("no data");
      video.pause();
      setTimeout(() => video.play(), 400);
      return null;
    }

    resume(video, timestamp.curr);
  });
});
