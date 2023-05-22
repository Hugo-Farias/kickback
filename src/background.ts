import { Message } from "./typeDef";

// send message to content Scripts every time the url updates
chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  if (changeInfo.title === undefined || changeInfo.title === "Kick") return;

  const message: Message = { type: "urlChanged", url: tab.url };
  chrome.tabs.sendMessage(tabId, message);
});
