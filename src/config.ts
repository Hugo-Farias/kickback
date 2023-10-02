export const timeStart = 60; //time to not store or delete when in range from start
export const timeEnd = 240; //time to not store or delete when in range from end
export const intervalSecs = 10; // time in between storing data to local storage in seconds
export const maxTimeStamps = 50; // max amount of timestamps to keep saved in storage
export const timeoutDuration = 50; // time in secs to disconnect all observers
export const storageTimestamps = "kbTimeStamps";
export const resumeVideo = true;
export const showProgressBarOnThumbs = true;
export const allowVideoInput = true;
export const videoInputAllowedKeys = allowVideoInput
  ? ["ArrowLeft", "ArrowRight"]
  : null;
export const videoInputSkipAmount = allowVideoInput ? 20 : 0;

chrome.storage.sync.get(["settings"]).then((v) => {
  console.log(v);
});
