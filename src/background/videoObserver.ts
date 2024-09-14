import { Message } from "../typeDef.ts";
import { waitForElement } from "../helper.ts";

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  console.log(message);
  waitForElement<HTMLVideoElement>("video").then((v) => {
    if (!v) return console.error("Video element not found");
    console.log(v.currentTime);
  });
});
