import { Message } from "./typeDef";

// send message to content Scripts every time the url updates
chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
    const tabId = details.tabId;
    const url = details.url;

    if (url && !url.includes("kick.com/video")) return;

    // const message: Message = { type: "urlChanged", url: url };
    // setTimeout(() => chrome.tabs.sendMessage(tabId, message), 5000);
    chrome.tabs.sendMessage(tabId, "urlChanged");
  }
);
