console.log("observer running");

function waitForVideo(callback: (video: HTMLVideoElement) => void) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLVideoElement) {
          observer.disconnect();
          callback(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

waitForVideo((video) => {
  console.log(video);
  console.log(video.currentTime);
});

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
    const currentUrl = window.location.href;

    // console.log(currentUrl);

    if (!message.url.includes("video")) return;

    waitForVideo((video) => {
      console.log(video);
      console.log(video.currentTime);
    });
  }
);

// let videoEl: HTMLVideoElement;
//
// const videoObserver = new MutationObserver((events) => {
//   console.log(events);
// });
//
// videoObserver.observe(videoEl);
//
// setTimeout(() => {
//   videoEl = document.querySelector("video");
//   console.log("-> videoEl", videoEl);
// }, 4000);
