import type { FullCache, SettingsT } from "@/types";
import { getVideoId } from "./helper";

export const removeProgressBar = () => {
  const existingBar = document.querySelectorAll("span#kb2-progress-bar");
  existingBar.forEach((bar) => {
    bar.remove();
  });
};

export const removeNowPlayingTag = () => {
  const existingTag = document.querySelectorAll("div#kb2-now-playing-tag");
  existingTag.forEach((tag) => {
    tag.remove();
  });
};

export const addNowPlayingTag = (currentSettings: SettingsT | null): void => {
  if (!currentSettings?.showNowPlayingTag) return;

  const currentId = getVideoId(
    document.querySelector<HTMLLinkElement>("link[rel='canonical']")?.href ||
      "",
  );

  const nowPlayingTag = document.createElement("div");

  // Adds 'now playing' tag
  nowPlayingTag.setAttribute("id", "kb2-now-playing-tag");
  nowPlayingTag.className =
    "tv:text-xs absolute z-controls rounded bg-surface-bg-lowest state-layer px-1 text-sm font-semibold top-1.5 right-1.5";
  nowPlayingTag.textContent = i18n.t("nowPlaying");
  const thumbnailEl = document.querySelector(
    `section > div > a[href$=${`'/videos/${currentId}'`}]`,
  );
  if (!thumbnailEl) return;

  thumbnailEl.appendChild(nowPlayingTag);
};

export const addProgressBar = (
  fullData: FullCache | null,
  streamerPath: string | undefined,
  currentSettings: SettingsT | null,
): void => {
  if (!streamerPath) return;

  const hrefSelector = `'/${streamerPath}/videos'`;
  const thumbnailNode = document.querySelectorAll<HTMLAnchorElement>(
    `section > div > a[href^=${hrefSelector}]`,
  );

  const maincolor = "#8af648";

  if (!fullData) return;

  thumbnailNode.forEach((thumbnailEl) => {
    const id = getVideoId(thumbnailEl.href);
    if (!id) return;

    if (!currentSettings?.showProgressBar) return;

    const data = fullData[id];
    if (!data) return;

    const spanBar: HTMLSpanElement = document.createElement("span");

    const percentage = (data.curr / data.total) * 100;

    spanBar.setAttribute("id", "kb2-progress-bar");
    spanBar.style.position = "absolute";
    spanBar.style.height = "3px";
    spanBar.style.width = "100%";
    spanBar.style.bottom = "0px";
    spanBar.style.background = `linear-gradient(to right, ${maincolor} ${percentage}%, #9c9c9c 0)`;
    spanBar.style.zIndex = "2";
    thumbnailEl.appendChild(spanBar);
  });
};
