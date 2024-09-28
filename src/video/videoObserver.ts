import { Message } from "../typeDef.ts";
import { getTimestamp, waitForElement } from "../helper.ts";
import {
  addEvent,
  removeAllIntervalls,
  onPlay,
  onPause,
  resume,
  onSeek,
  deleteOldFromData,
} from "./videoEvents.ts";

export let currentId: string;
export let currentVideo: HTMLVideoElement;

// If data has more than n elements, delete half of the oldest
// TODO additional real world testting
deleteOldFromData(100);

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  const newId = message.id;
  if (newId === currentId) return null;
  if (!newId) return null;
  removeAllIntervalls();
  currentId = newId;

  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video) return console.error("Video element not found");
    currentVideo = video;

    // Set intervals on play
    addEvent(video, "play", onPlay);

    // Clear intervals on pause
    addEvent(video, "pause", onPause);

    addEvent(video, "seeked", onSeek);

    //TODO remove this after debuging
    if (!getTimestamp(currentId)) {
      console.log("no data");
      return null;
    }

    resume();
  });
});
