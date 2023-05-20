export function deleteFromObject(keyPart: string, obj: { [key: string]: any }) {
  for (const k in obj) {
    if (~k.indexOf(keyPart)) {
      delete obj[k];
    }
  }
}

export const waitForElementList = function (
  el: string,
  url: string | null = null,
  check: string = "",
  callback: (element: Array<Element> | null) => void
) {
  if (url && !url.includes(check)) return;

  const observer = new MutationObserver(() => {
    const elementList: NodeListOf<Element> = document.querySelectorAll(el);
    if (elementList.length > 0) {
      observer.disconnect();
      callback([...elementList]);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};

export const waitForElement = function (
  el: string,
  url: string | null = null,
  check: string = "",
  callback: (element: Element) => {}
) {
  if (url && !url.includes(check)) return;

  const observer = new MutationObserver(() => {
    const element: Element | undefined = document.querySelector(el);
    if (element) {
      observer.disconnect();
      callback(element);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};
