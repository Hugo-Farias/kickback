const intervals: { [key: string]: number } = {};

export const removeAllIntervalls = () => {
  for (const key of Object.keys(intervals)) {
    clearInterval(intervals[key]);
  }
};

export const onPause = () => {
  console.log("pause");
  removeAllIntervalls();
};

export const onPlay = () => {
  console.log("play");
  removeAllIntervalls();
  intervals.play = setInterval(() => {
    console.log("interval");
  }, 1000);
};

// Keep track of eventListeners for removal and avoid duplicates
// const eventListeners = new WeakMap();

export const addEvent = (
  element: HTMLVideoElement,
  trigger: keyof HTMLVideoElementEventMap,
  execute: () => void,
) => {
  element.removeEventListener(trigger, execute);
  element.addEventListener(trigger, execute);
};
