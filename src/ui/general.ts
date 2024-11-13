import { MessageType } from "../background/background.ts";
import { waitForElement } from "../helper.ts";

chrome.runtime.onMessage.addListener((message: MessageType) => {
  console.log(message);
  waitForElement<HTMLDivElement>("group/main").then((value) => {
    console.log(value);
  });
});
