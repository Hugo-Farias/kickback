import { timeoutDuration } from "./config";

export const waitForElementList = function (
  el: string,
  callback: (element: Array<any> | null) => void
) {
  const observer = new MutationObserver(() => {
    const elementList: NodeListOf<any> = document.querySelectorAll(el);
    if (elementList.length > 0) {
      observer.disconnect();
      callback([...elementList]);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  setTimeout(() => {
    observer.disconnect(); // Stop the observer after the timeout
  }, timeoutDuration * 1000);
};

export const getIdFromUrl = function (s: string): string {
  return s.replace("https://kick.com/video/", "");
};
