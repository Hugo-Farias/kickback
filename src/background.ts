import { getIdFromUrl, getSettings } from "./helper.ts";

export const settingsDefaults = {
  progressBar: true,
  pausePlayClick: false,
  chatStatus: false,
};

export type SettingsValuesT = typeof settingsDefaults;

export type MessageType = {
  url: string;
  id: string | null;
  settings: SettingsValuesT;
};

let msgTimeout: number;

let msgSpeed = 1000;

// send message to content Scripts every time the url updates
chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  if (changeInfo.status !== "complete") return;

  const url = tab.url;
  if (!url) return;
  clearTimeout(msgTimeout);

  // Prevents the "Could not establish connection." Error. Don't remove it unless there's a better solution
  if (!url.includes("kick.com/")) return;

  msgTimeout = setTimeout(() => {
    getSettings().then((settings) => {
      const message: MessageType = {
        url: url,
        id: getIdFromUrl(url),
        settings: settings || settingsDefaults,
      };
      chrome.tabs.sendMessage(tabId, message).then();
    });
    // msgSpeed = 100;
  }, msgSpeed);
});

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   // console.log("-> details", details);
//   // console.log("History state updated for tab:", details.tabId);
//   // console.log("New URL:", details.url);
// });
