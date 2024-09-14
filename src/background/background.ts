import { Message } from "../typeDef";
import { getIdFromUrl } from "../helper.ts";

let msgTimeout: number;

// send message to content Scripts every time the url updates
chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  console.log(tab.title, changeInfo.status);
  if (changeInfo.status !== "complete") return;
  const url = tab.url;
  if (!url) return;
  if (!url.includes("videos")) return;

  const message: Message = {
    type: "urlChanged",
    url: url,
    id: getIdFromUrl(url),
  };

  if (msgTimeout) clearTimeout(msgTimeout);

  msgTimeout = setTimeout(() => {
    console.log("msg");
    return chrome.tabs.sendMessage(tabId, message);
  }, 500);
});

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   // console.log("-> details", details);
//   // console.log("History state updated for tab:", details.tabId);
//   // console.log("New URL:", details.url);
// });
