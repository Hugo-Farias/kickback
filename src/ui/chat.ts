import { waitForElement } from "../helper.ts";

// const logTest = function () {
//   const firstDiv = document.querySelector<HTMLDivElement>("body > div");
// console.log("clicked");
// };

export const closeChat = () => {
  waitForElement<HTMLDivElement>("body > div").then((value) => {
    if (!value) return null;

    // const closeChatBtn: HTMLButtonElement | null = document.querySelector(
    //   ".h-fit.w-fit.cursor-pointer > button",
    // );

    // const closeChatBtn = document.querySelector("body");

    // if (closeChatBtn) {
    //   addEvent(closeChatBtn, "click", logTest);
    // }

    value.dataset.chat = "false";
  });
};
