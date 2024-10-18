import { getIdFromUrl, getSettings } from "../helper.ts";
import { SettingsValuesT } from "../Settings.tsx";

export type MessageType = {
  type: "urlChanged";
  url: string;
  id: string | null;
  settings: SettingsValuesT;
};

let msgTimeout: number;
let message: MessageType;

// send message to content Scripts every time the url updates
chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  if (changeInfo.status !== "complete") return;
  const url = tab.url;
  if (!url) return;
  if (!url.includes("videos")) return;

  getSettings().then((settings) => {
    message = {
      type: "urlChanged",
      url: url,
      id: getIdFromUrl(url) || null,
      settings: settings,
    };

    if (msgTimeout) clearTimeout(msgTimeout);

    msgTimeout = setTimeout(() => {
      return chrome.tabs.sendMessage(tabId, message);
    }, 500);
  });
});

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   // console.log("-> details", details);
//   // console.log("History state updated for tab:", details.tabId);
//   // console.log("New URL:", details.url);
// });
