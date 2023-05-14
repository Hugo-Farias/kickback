console.log("observer running");

const url = window.location.href;
const urlId = url.replace("https://kick.com/video/", ""); // Current url video ID
const intervalSecs = 10; // Interval to store current time to local storage

// Wait for video element
function waitForVideo(callback: (video: HTMLVideoElement) => void) {
  if (!url.includes("video")) return;

  const observer = new MutationObserver(() => {
    const videoElement = document.querySelector("video");
    if (videoElement && videoElement.readyState >= 3) {
      observer.disconnect();
      callback(videoElement);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

// function to be called when video available
const resume = function (videoEl: HTMLVideoElement) {
  videoEl.currentTime = 1000;
};

const storeTime = function (videoEL: HTMLVideoElement) {
  const videoTime = videoEL.currentTime.toString();

  console.log(JSON.stringify({ [urlId]: [videoTime] }));
  localStorage.setItem("TimeStamps", JSON.stringify({ [urlId]: [videoTime] }));
};

// init
waitForVideo((videoEl) => {
  resume(videoEl);

  videoEl.addEventListener("play", () => {
    setInterval(() => storeTime(videoEl), intervalSecs * 1000);
  });
});

chrome.runtime.onMessage.addListener(() => {
  if (!url.includes("video")) return;

  waitForVideo((videoEl) => {
    resume(videoEl);
  });
});
