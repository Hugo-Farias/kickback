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

let video: HTMLVideoElement | null;

waitForVideo((videoElement) => {
  console.log("video loaded:", videoElement);
  video = videoElement;
});

// sets video time
const resumeVideo = function (time: number = 0, play: boolean = false) {
  video.currentTime = time;

  console.log("videoDOM", video.currentTime);

  if (play) video.play();

  let interval;

  video.addEventListener("play", () => {
    console.log("Video is playing");
    // interval = setInterval(() => {
    //   console.log("setinterval");
    // }, 10000);
  });

  video.addEventListener("pause", () => {
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
      resumeVideo(5000);
    }
  }
);
