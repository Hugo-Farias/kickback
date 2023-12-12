import { getSettings } from "../settings/settingsHelper";
import { waitForElement } from "../helper";

let chatState: boolean;

getSettings("chatState").then((v) => (chatState = v));

getSettings("sidebarState").then((v) => {
  if (!v) return;
  waitForElement(".sidebar-toggle-button", (el: HTMLDivElement) => {
    el.click();
  });
});

chrome.runtime.onMessage.addListener(() => {
  if (!chatState) return;
  waitForElement(".chat-content .base-icon", (el: HTMLDivElement) => {
    el.click();
  });
});
