console.log("KickBack Loaded");

// sets video time
const setVideoTime = function (time: number = 0) {
  const video = document.getElementsByTagName("video")[0];

  video.currentTime = 10000;

  console.log("videoDOM", video.currentTime);
};

interface Message {
  type: "urlChanged";
  url: string;
}

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    console.log(message.url);
    if (message.type === "urlChanged") {
      setVideoTime();
    }
  }
);
