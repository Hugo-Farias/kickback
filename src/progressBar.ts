import { waitForElementList } from "./helper";
import { getData } from "./videoHelper";
import { localStorageName } from "./config";
import { Message, StoredStamps } from "./typeDef";

const data: StoredStamps = getData(localStorageName, false) as StoredStamps;

const init = function () {
  waitForElementList(
    ".grid-item > div > a[href^='/video/']",
    (elArr: HTMLAnchorElement[]) => {
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

init();

chrome.runtime.onMessage.addListener((message: Message) => {
  console.log("-> message.type", message.type);
  if (message.type !== "urlChanged") return;
  init();
});
