interface UrlChangedMessage {
  type: "urlChanged";
  url: string;
}

chrome.tabs.onUpdated.addListener(
  (tabId: number, info: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    console.log(info.status);
    if (
      info.status === "complete" &&
      tab.url &&
      tab.url.includes("kick.com/video")
    ) {
      const message: UrlChangedMessage = { type: "urlChanged", url: tab.url };
      setTimeout(() => chrome.tabs.sendMessage(tabId, message), 5000);
      // chrome.tabs.sendMessage(tabId, message);
    }
  }
);
