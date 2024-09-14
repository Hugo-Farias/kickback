import { Message, Timestamp } from "../typeDef.ts";
import { getData, waitForElement } from "../helper.ts";

const intervals: { [key: string]: number } = {};

const resume = (videoElement: HTMLVideoElement, time: number) => {
  videoElement.currentTime = time;
};

const setTime = (id: string, time: number) => {
  console.log(id, time);
};

// Receive message from background and trigger every url updated event
chrome.runtime.onMessage.addListener((message: Message) => {
  if (!message.id) return null;

  waitForElement<HTMLVideoElement>("video").then((video) => {
    if (!video) return console.error("Video element not found");

    const data = getData(message.id + "") as Timestamp;

    video.addEventListener("play", () => {
      intervals.play = setInterval(() => {
        console.log("play");
        setTime(data.id, video.currentTime);
      }, 1000 * 3);
      console.log(intervals);
    });

    if (data) {
      resume(video, data.curr);
    }
  });
});
