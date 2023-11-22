import { getSettings } from "../settings/settingsHelper";
import { waitForElementList } from "../helper";

chrome.runtime.onMessage.addListener(() => {
  waitForElementList(
    ".chat-content .base-icon, .sidebar-toggle-button",
    (elArr: HTMLDivElement[] | null) => {
      if (
        (!getSettings("sidebarState") && !getSettings("chatContainerState")) ||
        !elArr
      )
        return;

      elArr.forEach((el) => {
        // console.log(el);
        // el.addEventListener("click", (v) => console.log(el.className));
        if (el.className.includes("base")) return;
        if (el.className.includes("sidebar")) return;

        el.click();
      });
    }
  );
});
