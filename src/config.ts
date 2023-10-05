export const timeStart = 60; //time to not store or delete when in range from start
export const timeEnd = 240; //time to not store or delete when in range from end
export const intervalSecs = 10; // time in between storing data to local storage in seconds
export const maxTimeStamps = 50; // max amount of timestamps to keep saved in storage
export const observerTimeoutSecs = 50; // time in secs to disconnect all observers
export const storageTimestamps = "kbTimeStamps";
export const settingsStorageLabel = "settings";
// export let resumeVideo = true;
// export let showProgressBarOnThumbs = true;
// export let allowVideoInput = true;
// export const videoInputAllowedKeys = allowVideoInput
//   ? ["ArrowLeft", "ArrowRight"]
//   : null;
// export const videoInputSkipAmount = allowVideoInput ? 2 : 0;

// chrome.storage.local
//   .get(["settings"])
//   .then((v: { settings: defaultStateT }) => {
//     const set = v.settings;
//     // allowVideoInput = set.skip.value;
//     resumeVideo = set.resume.value;
//     showProgressBarOnThumbs = set.progressBar.value;
//   });
