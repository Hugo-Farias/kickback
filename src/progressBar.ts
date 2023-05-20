import { waitForElementList } from "./helper";
import { getData } from "./videoHelper";
import { localStorageName } from "./config";

let url: string = window.location.href;

console.log("progressBar running");

// const broadcasts = document.querySelectorAll(".mt-5");

waitForElementList(
  ".grid-item > div > a[href^='/video/']",
  url,
  "video",
  (elArr: Array<Element>) => {
    const storedIds: Set<string> | string[] = getData(
      localStorageName,
      true
    ).lookup;

    console.log(storedIds);
    const idArr: Array<string> = elArr?.map((v: HTMLAnchorElement) => v.href);
    // console.log(idArr);
  }
);
