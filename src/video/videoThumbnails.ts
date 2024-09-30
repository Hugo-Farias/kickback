import { waitForElement } from "../helper.ts";

chrome.runtime.onMessage.addListener(() => {
  waitForElement(".grid.h-full.grid-cols-1 > div > a[href]").then((grid) => {
    console.log(grid);
  });
});
