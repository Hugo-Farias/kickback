import type { StoredData } from "@/types";
import { getVideoId } from "./helper";

export const renderProgressBar = (
  fullData: StoredData | null,
  streamerPath: string,
) => {
  const checkForExistingBar = document.querySelector("span#progress-bar");
  if (checkForExistingBar) return;
  const hrefSelector = `'/${streamerPath}/videos'`;
  if (!fullData) return;
  const currentId = window.location.href.split("/").slice(-1)[0];
  const elements = document.querySelectorAll<HTMLAnchorElement>(
    `section > div > a[href^=${hrefSelector}]`,
  );

  elements.forEach((thumbnailEl) => {
    const id = getVideoId(thumbnailEl.href);
    if (!id) return;
    const data = fullData[id];
    if (!data) return;

    if (id === currentId) {
      const nowPlayingTag = document.createElement("div");

      // Adds 'now playing' tag
      nowPlayingTag.className =
        "z-controls state-layer-surface bg-surface-lowest tv:text-xs absolute rounded px-1 text-sm font-semibold top-1.5 right-1.5";
      nowPlayingTag.textContent = i18n.t("NowPlaying");
      // nowPlayingTag.style.backgroundColor = darkerGreen;
      // nowPlayingTag.style.color = "black";
      thumbnailEl.appendChild(nowPlayingTag);
    }

    const spanBar: HTMLSpanElement = document.createElement("span");

    const percentage = (data.curr / data.total) * 100;

    spanBar.setAttribute("id", "progress-bar");
    spanBar.style.position = "absolute";
    spanBar.style.height = "3px";
    spanBar.style.width = "100%";
    spanBar.style.bottom = "0px";
    spanBar.style.background = `linear-gradient(to right, #8af648 ${percentage}%, #9c9c9c 0)`;
    spanBar.style.zIndex = "2";
    thumbnailEl.appendChild(spanBar);
  });
};
