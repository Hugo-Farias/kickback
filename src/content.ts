console.log("KickBack Loaded");

// window.onReady = () => {
//   const video = document.getElementsByTagName("video")[0];
//   console.log(video);
// };

// sets video time
const resumeVideo = function (time: number = 0, play: boolean = false) {
  let video;
  video = document.getElementsByTagName("video")[0];

  // console.log("videoDOM", video);

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
