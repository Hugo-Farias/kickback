import { getSettings } from "../settings/settingsHelper";
import { waitForElementList } from "../helper";

chrome.runtime.onMessage.addListener(() => {
  waitForElementList(
    ".chat-container .base-icon, .sidebar-toggle-button",
    (elArr: HTMLDivElement[] | null) => {
      if (!getSettings("uiState")) return;
      elArr?.forEach((v) => {
        v.click();
      });
    }
  );
});
