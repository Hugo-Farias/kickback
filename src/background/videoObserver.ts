import { Message } from "../typeDef.ts";
import { getData, waitForElement } from "../helper.ts";

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  if (!message.id) return null;

  waitForElement<HTMLVideoElement>("video").then((v) => {
    if (!v) return console.error("Video element not found");

    console.log(getData("0a7b0064-e80b-48b3-89d3-9c6ec215cfa6"));
  });
});
