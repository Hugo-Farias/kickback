import { getIdFromUrl, waitForElementList } from "../helper";
import { data } from "./videoObserver";
import { showProgressBarOnThumbs } from "../config";

const init = function () {
  if (!showProgressBarOnThumbs) return;
  const currentId: string = getIdFromUrl(window.location.href);

  waitForElementList(
    ".grid-item > div > a[href^='/video/']",
    (elArr: HTMLAnchorElement[] | null) => {
      if (!elArr) return null;

      elArr.forEach((v) => {
        const id = getIdFromUrl(v.href);

        if (currentId === id) {
          const nowPlayingTag = document.createElement("div");

          nowPlayingTag.className =
            "right-2 top-2 rounded bg-black/80 px-1 text-sm font-light text-white";
          nowPlayingTag.style.position = "absolute";
          nowPlayingTag.textContent = "Now Playing";
          v.appendChild(nowPlayingTag);
        }

        if (!data.timestamps[id]) return;

        const currTime: number = data.timestamps[id].curr;
        const totalTime: number = data.timestamps[id].total;
        const percentage = (currTime / totalTime) * 100;

        const div = document.createElement("div");

        const color = "#53FC18";

        div.style.position = "absolute";
        div.style.height = "4px";
        div.style.width = "100%";
        div.style.bottom = "0";
        div.style.background = `linear-gradient(to right, ${color} ${percentage}%, #9c9c9c 0)`;
        v.style.position = "relative";

        v.appendChild(div);
      });
    }
  );
};

chrome.runtime.onMessage.addListener(() => {
  let retries = 30;
  const intervalId = setInterval(() => {
    if (data) {
      clearInterval(intervalId);
      init();
      return;
    }
    // Kill the interval if waitFor never arrives after the amount of retries
    if (!(retries - 1)) {
      clearInterval(intervalId);
      console.error("data couldn't be retrieved");
      return;
    }
    retries--;
  }, 500);
});
