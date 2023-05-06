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

waitForVideo((videoElement) => {
  console.log("video loaded:", videoElement);
});
