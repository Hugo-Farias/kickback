import { getDataFromStorage, getIdFromUrl, waitForElement } from "../helper.ts";
import { MessageType } from "../background.ts";

export const progressBarRender = (message: MessageType) => {
  const data = getDataFromStorage();

  waitForElement<HTMLAnchorElement, true>("section > div > a[href]", true).then(
    (vidLinks) => {
      if (!vidLinks) return null;

      vidLinks.forEach((link) => {
        const id = getIdFromUrl(link.href);
        // link.style.border = "2rem";
        // link.style.borderColor = "red";

        if (!id) return null;
        // if (!data[id]) return null;
        const primaryGreen = "#53FC18";

        console.log(id, message.id === id);

        if (message.id === id) {
          console.log("now playing tag rendered");
          const nowPlayingTag = document.createElement("div");

          // Adds thumbnail green border to currently playing video's link
          // link.style.outline = `2px solid ${primaryGreen}`;

          // Adds 'now playing' tag
          nowPlayingTag.className =
            "z-controls absolute rounded bg-[#070809] bg-opacity-80 px-1.5 py-1 text-xs font-semibold top-1.5 right-1.5";
          nowPlayingTag.textContent = chrome.i18n.getMessage("nowPlaying");
          // nowPlayingTag.style.backgroundColor = darkerGreen;
          // nowPlayingTag.style.color = "black";
          link.appendChild(nowPlayingTag);
        }

        const currTime = data[id].curr;
        const totalTime = data[id].total;
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
