import { Message } from "../typeDef";

let msgTimeout: number;

// send message to content Scripts every time the url updates
chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  if (changeInfo.title === undefined || changeInfo.title === "Kick") return;
  const url = tab.url;
  if (!url) return;

  const message: Message = { type: "urlChanged", url: url };

  if (msgTimeout) clearTimeout(msgTimeout);

  msgTimeout = setTimeout(() => {
    return chrome.tabs.sendMessage(tabId, message);
  }, 1000);
});

chrome.storage.sync.set({ test: 2 });

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   // console.log("-> details", details);
//   // console.log("History state updated for tab:", details.tabId);
//   // console.log("New URL:", details.url);
// });
