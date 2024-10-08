import { getIdFromUrl, waitForElementList } from "../helper";
import { data, urlId } from "./videoObserver";
// import { getSettings } from "../settings/settingsHelper";

const init = function () {
  waitForElementList(
    ".grid.h-full.grid-cols-1 > div > a[href]",
    (elArr: HTMLAnchorElement[] | null) => {
      if (!elArr) return null;
      elArr.forEach((v) => {
        const id = getIdFromUrl(v.href);

        if (urlId === id) {
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
    },
  );
};

// getSettings("progressBar").then((value) => {
//   if (!value) return;
chrome.runtime.onMessage.addListener(() => {
  let retries = 30;
  const intervalId = setInterval(() => {
    retries--;
    if (data || urlId) {
      clearInterval(intervalId);
      init();
      return;
    }
    // Kill the interval if out of retries
    if (!retries) {
      clearInterval(intervalId);
      console.error("data couldn't be retrieved");
      return;
    }
  }, 500);
});
// });
