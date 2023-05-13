interface UrlChangedMessage {
  type: "urlChanged";
  url: string;
}

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
    const tabId = details.tabId;
    const url = details.url;
    if (url && url.includes("kick.com/video")) {
      const message: UrlChangedMessage = { type: "urlChanged", url: url };
      // setTimeout(() => chrome.tabs.sendMessage(tabId, message), 5000);
      chrome.tabs
        .sendMessage(tabId, message)
        .then((response) => {
          console.log("Message sent successfully:", response);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  }
);

// interface UrlChangedMessage {
//   type: "urlChanged";
//   url: string;
// }
//
// chrome.tabs.onUpdated.addListener(
//   (tabId: number, info: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
//     if (
//       tab.status === "complete" &&
//       tab.title !== "Kick" &&
//       tab.url &&
//       tab.url.includes("kick.com/video")
//     ) {
//       console.log("message");
//
//       const message: UrlChangedMessage = { type: "urlChanged", url: tab.url };
//       // setTimeout(() => chrome.tabs.sendMessage(tabId, message), 5000);
//       chrome.tabs.sendMessage(tabId, message);
//     }
//   }
// );
