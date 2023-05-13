console.log("observer running");

function waitForVideo(callback: (video: HTMLVideoElement) => void) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLVideoElement) {
          // observer.disconnect();
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
});

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
