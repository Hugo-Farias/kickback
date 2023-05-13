console.log("content.ts Loaded");

let video: HTMLVideoElement;

function waitForVideo(callback) {
  const observer = new MutationObserver(() => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      observer.disconnect();
      callback(videoElement);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

// waitForVideo((videoElement) => {
//   // console.log(videoElement);
//   video = videoElement;
// });

// const storeVideoTime = function (videoId: string) {
//   localStorage.setItem(videoId, video.currentTime + "");
// };

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
    if (message.type !== "urlChanged") return;

    waitForVideo((element) => {
      video = element;
      console.log(video);
    });
  }
);
