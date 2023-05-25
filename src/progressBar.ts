import { getIdFromUrl, waitForElementList } from "./helper";
import { getData } from "./videoHelper";
import { localStorageName, showProgressBarOnThumbs } from "./config";
import { StoredStamps } from "./typeDef";

const data: StoredStamps = getData(localStorageName, false) as StoredStamps;

const init = function () {
  if (!showProgressBarOnThumbs) return;
  const currentId: string = getIdFromUrl(window.location.href);

  waitForElementList(
    ".grid-item > div > a[href^='/video/']",
    (elArr: HTMLAnchorElement[] | null) => {
      if (!elArr) return null;

      elArr.forEach((v) => {
        const id = getIdFromUrl(v.href);

        if (!data.timestamps[id]) return;

        const currTime: number = data.timestamps[id].curr;
        const totalTime: number = data.timestamps[id].total;
        const percentage = (currTime / totalTime) * 100;

        const div = document.createElement("div");

        const color = "#53FC18";

        // if (currentId === id) {
        //   color = "#2f8110";
        //   v.style.border = `1px solid ${color}`;
        // }

        div.style.position = "absolute";
        div.style.height = "4px";
        div.style.width = "100%";
        div.style.bottom = "0";
        div.style.background = `linear-gradient(to right, ${color} ${percentage}%, #9c9c9c 0)`;

        v.style.position = "relative";
        v.style.overflow = "show";

        v.appendChild(div);

        if (currentId === id) {
          const npDiv = document.createElement("div");

          npDiv.className =
            "right-2 top-2 rounded bg-black/80 px-1 text-sm font-light text-white";
          npDiv.style.position = "absolute";
          npDiv.textContent = "Now Playing";
          // npDiv.style.paddingInline = "0.25rem";
          // npDiv.style.height = "50px";
          // npDiv.style.width = "100px";
          // npDiv.style.backgroundColor = "rgba(0,0,0,0.4)";
          // npDiv.style.top = "0";
          // npDiv.style.right = "0";
          v.appendChild(npDiv);
        }
      });
    }
  );
};

chrome.runtime.onMessage.addListener(() => {
  init();
});
