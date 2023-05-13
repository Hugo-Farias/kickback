// sets video time
const resumeVideo = function (
  videoEl: HTMLVideoElement,
  time: number = 0,
  play: boolean = false
) {
  videoEl.currentTime = time;

  console.log("-> videoEl.currentTime", videoEl.currentTime);

  if (play) videoEl.play();
};
