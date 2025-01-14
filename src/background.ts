import { getIdFromUrl, getSettings } from "./helper.ts";

export const settingsDefaults = {
  progressBar: true,
  playingBorder: false,
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

let firstRun = false;

// TODO find a better way to init on page load
// send message to content Scripts every time the url updates
chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  if (!firstRun && changeInfo.status !== "complete") return;
  firstRun = true;

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

      console.log("msg");
      chrome.tabs.sendMessage(tabId, message).then();
    });
  }, 1000);
});

// chrome.webNavigation.onCompleted.addListener((details) => {
//   const url = details.url;
//   const tabId = details.tabId;
//
//   clearTimeout(msgTimeout);
//
//   msgTimeout = setTimeout(() => {
//     getSettings().then((settings) => {
//       const message: MessageType = {
//         url: url,
//         id: getIdFromUrl(url),
//         settings: settings || settingsDefaults,
//       };
//       chrome.tabs.sendMessage(tabId, message).then();
//     });
//   }, 300);
// });
