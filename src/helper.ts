import { timeoutDuration } from "./config";

export function deleteFromObject(keyPart: string, obj: { [key: string]: any }) {
  for (const k in obj) {
    if (~k.indexOf(keyPart)) {
      delete obj[k];
    }
  }
}

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

export const getIdFromUrl = function (url: string): string {
  return url.replace("https://kick.com/video/", "");
};
