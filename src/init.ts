import { MessageType } from "./background.ts";
import { resumeVideo, deleteOldFromData } from "./video/videoEvents.ts";
import { progressBarRender } from "./ui/videoThumbs.ts";
import { closeChat } from "./ui/chat.ts";

// If data has double or more than n elements, delete half from oldest to newest
deleteOldFromData(100);

let firstRun = true;

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: MessageType) => {
  console.clear();
  resumeVideo(message);

  if (message.settings.progressBar) {
    progressBarRender();
  }

  // Only run once section
  if (!firstRun) return null;
  firstRun = false;

  if (message.settings.chatStatus) {
    closeChat();
  }
});
