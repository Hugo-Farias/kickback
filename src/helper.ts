// sets video time
const resumeVideo = function (
  videoEl: HTMLVideoElement,
  time: number = 0,
  play: boolean = false
) {
  videoEl.currentTime = time;

  console.log("-> videoEl.currentTime", videoEl.currentTime);

  if (play) videoEl.play();

  // let interval;
  //
  // videoEl.addEventListener("play", () => {
  //   console.log("Video is playing");
  //   // interval = setInterval(() => {
  //   //   console.log("setinterval");
  //   // }, 10000);
  // });
  //
  // videoEl.addEventListener("pause", () => {
  //   console.log("Video is paused");
  //   interval.clear;
  // });
};
