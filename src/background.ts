interface UrlChangedMessage {
  type: "urlChanged";
  url: string;
}

let completeCount = 0;

chrome.tabs.onUpdated.addListener(
  (tabId: number, info: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    console.log(info.status);

    if (info.status === undefined) completeCount++;

    console.log(completeCount);

    if (completeCount === 3 && tab.url && tab.url.includes("kick.com/video")) {
      const message: UrlChangedMessage = { type: "urlChanged", url: tab.url };
      completeCount = 0;

      // setTimeout(() => chrome.tabs.sendMessage(tabId, message), 5000);
      // chrome.tabs.sendMessage(tabId, message);
    }
  }
);

// interface UrlChangedMessage {
//   type: "urlChanged";
//   url: string;
// }
//
// chrome.webNavigation.onCompleted.addListener(
//   (details) => {
//     const tabId = details.tabId;
//     const url = details.url;
//     if (url.includes("kick.com/video")) {
//       const message: UrlChangedMessage = { type: "urlChanged", url: url };
//       chrome.tabs.sendMessage(tabId, message);
//     }
//   },
//   { url: [{ urlMatches: "kick.com/video" }] }
// );
