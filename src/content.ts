console.log("KickBack Loaded");

// sets video time
const videoDOM = function () {
  console.log("in videoDOM");
  const currentURL: "video" | "/" = window.history.state.current;

  if (currentURL.slice(1, 6).toLowerCase() !== "video") return;

  const video = document.getElementsByTagName("video")[0];

  console.log("video", video);
};

interface Message {
  url: string;
}

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    console.log(message.url);
    // console.log(message.url.slice(8, 12));
    // console.log(message.url.slice(8, 12) === "kick");
    if (message.url.slice(8, 12) === "kick") {
      videoDOM();
    }
  }
);
