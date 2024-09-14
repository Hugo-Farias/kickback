import { Message } from "../typeDef";

let msgTimeout: number;

// send message to content Scripts every time the url updates
chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  _: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  console.log(tab.url);
  if (tab.status !== "complete" || tab.title?.includes("kick.com")) return;
  const url = tab.url;
  if (!url) return;
  if (!url.includes("videos")) return;
  console.log(url);

  const message: Message = { type: "urlChanged", url: url };

  if (msgTimeout) clearTimeout(msgTimeout);

  msgTimeout = setTimeout(() => {
    return chrome.tabs.sendMessage(tabId, message);
  }, 500);
});

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   // console.log("-> details", details);
//   // console.log("History state updated for tab:", details.tabId);
//   // console.log("New URL:", details.url);
// });
