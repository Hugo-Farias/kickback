import { waitForElement } from "../helper.ts";

// const logTest = function () {
//   const firstDiv = document.querySelector<HTMLDivElement>("body > div");
// console.log("clicked");
// };

export const closeChat = () => {
  // waitForElement<HTMLDivElement>("body > div").then((value) => {
  //   if (!value) return null;

  // const closeChatBtn: HTMLButtonElement | null = document.querySelector(
  //   ".h-fit.w-fit.cursor-pointer > button",
  // );

  // const closeChatBtn = document.querySelector("body");

  // if (closeChatBtn) {
  //   addEvent(closeChatBtn, "click", logTest);
  // }

  // value.dataset.chat = "false";
  // });

  // 2ND method
  waitForElement<HTMLButtonElement>(
    "html > body > div > div:nth-of-type(2) > div:nth-of-type(4) > div:nth-of-type(1) > main > div:nth-of-type(1) > div:nth-of-type(1) > button",
  ).then((button) => {
    if (!button) return null;
    button.click();
  });
};
