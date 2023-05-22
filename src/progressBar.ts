import { waitForElementList } from "./helper";
import { getData } from "./videoHelper";
import { localStorageName } from "./config";
import { Message } from "./typeDef";

const init = function () {
  waitForElementList(
    ".grid-item > div > a[href^='/video/']",
    (elArr: Array<Element>) => {
      const storedIds = getData(localStorageName, false).lookup as string[];

      const idArr: HTMLAnchorElement[] = elArr?.map(
        (v: HTMLAnchorElement) => v
      );

      const filteredArr: HTMLAnchorElement[] = idArr.filter(
        (v: HTMLAnchorElement) => {
          v.style.position = "relative";
          return storedIds.includes(
            v.href.replace("https://kick.com/video/", "")
          );
        }
      );

      console.log(filteredArr);
      filteredArr.forEach((anchor: HTMLAnchorElement) => {
        const div = document.createElement("div");
        div.className = "progress-bar";
        div.style.position = "absolute";
        div.style.height = "3px";
        div.style.width = "100%";
        div.style.bottom = "0";
        div.style.background =
          "linear-gradient(to right, #53FC18 10%, white 0)"; // Customize the background color as needed
        // div.style.backgroundColor = "#53FC18"; // Customize the background color as needed
        // div.style.backgroundColor = "white"; // Customize the background color as needed
        // div.style.backgroundColor = "rgba(83,252,24,0.9)";

        anchor.style.position = "relative";

        anchor.appendChild(div);
      });
    }
  );
};

init();

chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type !== "urlChanged") return;
  init();
});
