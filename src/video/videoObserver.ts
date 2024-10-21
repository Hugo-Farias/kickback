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

// If data has double than n elements, delete half by oldest to newest

deleteOldFromData(100);

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: MessageType) => {
  const newId = message.id;
  if (newId === currentId) return null;
  if (!newId) return null;
  removeAllIntervalls();
  currentId = newId;

  waitForElement<HTMLVideoElement>("video", false).then((video) => {
    if (!video) return null;
    currentVideo = video;

    // Set intervals on play
    addEvent(video, "play", onPlay);

    // Set intervals on seek
    addEvent(video, "seeked", onSeek);

    // Clear intervals on pause
    addEvent(video, "pause", onPause);

    // Check for settings
    if (message.settings && message.settings.pausePlayClick) {
      // Set click event listenter on video;
      addEvent(video, "click", onClick);
    }

    // init
    resume();
  });
});
