import { waitForElement } from "../helper.ts";

chrome.runtime.onMessage.addListener(() => {
  waitForElement<HTMLDivElement, true>(
    ".grid.h-full.grid-cols-1 > div > a[href]",
    true,
  ).then((grid) => {
    if (!grid) return null;
    console.log([...grid][0]);
  });
});
