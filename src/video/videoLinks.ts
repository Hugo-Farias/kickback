import { getDataFromStorage, getIdFromUrl, waitForElement } from "../helper.ts";
import { currentId } from "./videoObserver.ts";
import { MessageType } from "../background/background.ts";

chrome.runtime.onMessage.addListener((message: MessageType) => {
  if (message.settings && !message.settings.progressBar) return null;

  const data = getDataFromStorage();

  waitForElement<HTMLAnchorElement, true>(
    ".grid.h-full.grid-cols-1 > div > a[href]",
    true,
  ).then((vidLinks) => {
    if (!vidLinks) return null;

    vidLinks.forEach((link) => {
      const id = getIdFromUrl(link.href);
      // link.style.border = "2rem";
      // link.style.borderColor = "red";

      if (currentId === id) {
        const nowPlayingTag = document.createElement("div");

        // Adds thumbnail green border to currently playing video's link
        // link.style.border = "1px solid #53FC18";

        // Adds 'now playing' tag
        nowPlayingTag.className =
          "z-controls absolute rounded bg-[#070809] bg-opacity-80 px-1.5 py-1 text-xs font-semibold top-1.5 right-1.5";
        nowPlayingTag.textContent = "Now Playing";
        link.appendChild(nowPlayingTag);
      }

      if (!id) return null;
      if (!data[id]) return null;

      const currTime = data[id].curr;
      const totalTime = data[id].total;
      const percentage = (currTime / totalTime) * 100;

      const div = document.createElement("div");

      const color = "#53FC18";

      // Adds progress bar to video link thumbnails
      div.style.position = "absolute";
      div.style.height = "3px";
      div.style.width = "100%";
      div.style.bottom = "0";
      div.style.background = `linear-gradient(to right, ${color} ${percentage}%, #9c9c9c 0)`;
      link.style.position = "relative";

      link.appendChild(div);
    });
  });
});
