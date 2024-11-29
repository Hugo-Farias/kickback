import { MessageType } from "./background.ts";
import {
  deleteOldFromData,
  removeAllIntervalls,
  resumeVideo,
} from "./video/videoEvents.ts";
import { progressBarRender } from "./ui/videoThumbs.ts";
import { closeChat } from "./ui/chat.ts";

// If data has double or more than n elements, delete half by oldest to newest
deleteOldFromData(100);

let firstRun = true;

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: MessageType) => {
  resumeVideo(message, firstRun);

  // Clear all intervals related to video
  removeAllIntervalls();

  if (message.settings.progressBar) {
    progressBarRender(message);
  }

  // Only run once section
  if (!firstRun) return null;

  if (message.settings.chatStatus) {
    closeChat();
  }

  firstRun = false;
});
