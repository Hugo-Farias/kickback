import { MessageType } from "../background/background.ts";
import { waitForElement } from "../helper.ts";
import {
  addEvent,
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
  const newId = message.id;

  waitForElement<HTMLVideoElement>("video", false).then((video) => {
    if (!video) return null;
    currentVideo = video;

    // Check for settings
    if (message.settings.pausePlayClick) {
      // Set click event listenter on video;
      addEvent(video, "click", onClick);
    }

    removeAllIntervalls();
    // This Clause prevents atempting to resume and save data on livestreams
    if (!newId) return null;
    // This prevents a re-run on the same video
    if (newId === currentId) return null;
    currentId = newId;

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
