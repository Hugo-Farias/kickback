import { Message, Timestamp } from "../typeDef.ts";
import { getData, waitForElement } from "../helper.ts";

const intervals: { [key: string]: number } = {};

const resume = (videoElement: HTMLVideoElement, time: number) => {
  videoElement.currentTime = time;
};

const setTime = (id: string, time: number) => {
  console.log(id, time);
};

const onPlay = (id: string, time: number) => {
  intervals.play = setInterval(() => {
    console.log("play");
    setTime(id, time);
  }, 1000 * 3);
  console.log(intervals);
};

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  if (!message.id) return null;

  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video) return console.error("Video element not found");

    const data = getData(message.id + "") as Timestamp;

    // Set intervals on play
    video.addEventListener(
      "play",
      onPlay.bind(null, data.id, video.currentTime),
    );

    // Clear intervals on pause
    video.addEventListener("pause", () => {
      clearInterval(intervals.play);
    });

    if (data) {
      resume(video, data.curr);
    }
  });
});
