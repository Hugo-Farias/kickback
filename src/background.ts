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

let messagesSent = 0;

const sendMsg = function (tabId: number, message: MessageType) {
  setTimeout(() => {
    chrome.tabs.sendMessage(tabId, message).catch(() => {
      if (++messagesSent > 500) {
        console.error("failed");
        return null;
      }
      console.log("Attempt #", messagesSent, "to send message");
      sendMsg(tabId, message);
    });
  }, 100);
};

// send message to content Scripts every time the url updates
chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  console.log(changeInfo);
  if (changeInfo.status !== "complete") return;

  messagesSent = 0;

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

      sendMsg(tabId, message);
    });
  }, 200);
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
