import { getIdFromUrl, getSettings } from "../helper.ts";
import { SettingsValuesT } from "../Settings.tsx";

export type MessageType = {
  url: string;
  id: string | null;
  settings: SettingsValuesT;
};

let msgTimeout: number;

export const settingsDefaults: SettingsValuesT = {
  progressBar: true,
  pausePlayClick: false,
  chatStatus: false,
};

// send message to content Scripts every time the url updates
chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  if (changeInfo.status !== "complete") return;
  const url = tab.url;
  if (!url) return;

  // Prevents the "Could not establish connection." Error. Don't remove it unless there's a better solution
  if (!url.includes("kick.com/")) return;

  getSettings().then((settings) => {
    const message: MessageType = {
      url: url,
      id: getIdFromUrl(url),
      settings: settings || settingsDefaults,
    };

    if (msgTimeout) clearTimeout(msgTimeout);

    msgTimeout = setTimeout(() => {
      return chrome.tabs.sendMessage(tabId, message);
    }, 1000);
  });
});

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   // console.log("-> details", details);
//   // console.log("History state updated for tab:", details.tabId);
//   // console.log("New URL:", details.url);
// });
