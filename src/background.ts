type detailsT = chrome.webNavigation.WebNavigationFramedCallbackDetails;
type tabsT = chrome.tabs.Tab;

chrome.webNavigation.onCompleted.addListener((details: detailsT) => {
  // Send a message to the content script with the new URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: tabsT[]) => {
    if (tabs.length < 1) return null;
    return chrome.tabs.sendMessage(tabs[0].id!, { url: details.url });
  });
});
