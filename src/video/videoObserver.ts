import { MessageType } from "../background.ts";
import { waitForElement, addEvent } from "../helper.ts";
import {
  removeAllIntervalls,
  onPlay,
  onPause,
  onSeek,
  resume,
  deleteOldFromData,
  onClick,
} from "./videoEvents.ts";

export let currentId: string;
export let currentVideo: HTMLVideoElement;

// If data has double or more than n elements, delete half by oldest to newest
deleteOldFromData(100);

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: MessageType) => {
  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video) return null;
    console.log(video.readyState);

    currentVideo = video;

    // Check for settings
    if (message.settings.pausePlayClick) {
      // Set click event listenter on video;
      addEvent(video, "click", onClick);
    }

    removeAllIntervalls();
    // This Clause prevents atempting to resume and save data on livestreams
    if (!message.id) return null;
    // This prevents a re-run on the same video
    if (message.id === currentId) return null;

    currentId = message.id;

    // Set intervals on play
    addEvent(video, "play", onPlay);

    // Set intervals on seek
    addEvent(video, "seeked", onSeek);

    // Clear intervals on pause
    addEvent(video, "pause", onPause);

    // init
    resume();
  });
});
