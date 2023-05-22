import { waitForElementList } from "./helper";
import { getData } from "./videoHelper";
import { localStorageName } from "./config";
import { StoredStamps } from "./typeDef";

const data: StoredStamps = getData(localStorageName, false) as StoredStamps;

const init = function () {
  waitForElementList(
    ".grid-item > div > a[href^='/video/']",
    (elArr: HTMLAnchorElement[] | null) => {
      if (!elArr) return null;

      elArr.forEach((v) => {
        const id = v.href.replace("https://kick.com/video/", "");

        if (!data.timestamps[id]) return;

        const currTime: number = data.timestamps[id].curr;
        const totalTime: number = data.timestamps[id].total;
        const percentage = (currTime / totalTime) * 100;

        const div = document.createElement("div");
        div.className = "progress-bar";
        div.style.position = "absolute";
        div.style.height = "3px";
        div.style.width = "100%";
        div.style.bottom = "0";
        div.style.background = `linear-gradient(to right, #53FC18 ${percentage}%, white 0)`;

        v.style.position = "relative";

        v.appendChild(div);
      });
    }
  );
};

chrome.runtime.onMessage.addListener(() => {
  init();
});
