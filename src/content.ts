console.log("content.ts Loaded");

function waitForVideo(callback) {
  const observer = new MutationObserver((mutations) => {
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

// sets video time
const resumeVideo = function (
  videoEl: HTMLVideoElement,
  time: number = 0,
  play: boolean = false
) {
  videoEl.currentTime = time;

  console.log("videoDOM", videoEl.currentTime);

  if (play) videoEl.play();

  let interval;

  videoEl.addEventListener("play", () => {
    console.log("Video is playing");
    // interval = setInterval(() => {
    //   console.log("setinterval");
    // }, 10000);
  });

  videoEl.addEventListener("pause", () => {
    console.log("Video is paused");
    interval.clear;
  });
};

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
    if (message.type === "urlChanged") {
      console.log("urlChanged");
      waitForVideo((videoElement) => {
        console.log("video loaded:", videoElement);
      });
    }
  }
);
