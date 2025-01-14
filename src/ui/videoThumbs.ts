import { getDataFromStorage, getIdFromUrl, waitForElement } from "../helper.ts";
import { MessageType } from "../background.ts";

const primaryGreen = "#53FC18";
// const darkerGreen = "#4fda1b";

export const progressBarRender = (message: MessageType) => {
  const data = getDataFromStorage();

  waitForElement<HTMLAnchorElement, true>("section > div > a[href]", true).then(
    (vidLinks) => {
      if (!vidLinks) return null;

      vidLinks.forEach((link) => {
        const idFromUrl = getIdFromUrl(link.href);
        if (!idFromUrl) return null;

        if (message.id === idFromUrl) {
          const nowPlayingTag = document.createElement("div");

          // Adds 'now playing' tag
          nowPlayingTag.className =
            "z-controls absolute rounded bg-[#070809] bg-opacity-80 px-1.5 py-1 text-xs font-semibold top-1.5 right-1.5";
          nowPlayingTag.textContent = chrome.i18n.getMessage("nowPlaying");
          // nowPlayingTag.style.backgroundColor = darkerGreen;
          // nowPlayingTag.style.color = "black";
          link.appendChild(nowPlayingTag);
        }

        if (!data[idFromUrl]) return null;
        const currTime = data[idFromUrl].curr;
        const totalTime = data[idFromUrl].total;
        const percentage = (currTime / totalTime) * 100;

        const div = document.createElement("div");

        // Adds progress bar to video link thumbnails
        div.style.position = "absolute";
        div.style.height = "3px";
        div.style.width = "100%";
        div.style.bottom = "0";
        div.style.background = `linear-gradient(to right, ${primaryGreen} ${percentage}%, #9c9c9c 0)`;
        link.style.position = "relative";

        link.appendChild(div);
      });
    },
  );
};
