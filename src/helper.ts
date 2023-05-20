export function deleteFromObject(keyPart: string, obj: { [key: string]: any }) {
  for (const k in obj) {
    if (~k.indexOf(keyPart)) {
      delete obj[k];
    }
  }
}

export function waitForElement(
  el: string,
  url: string | null = null,
  callback: (video: HTMLVideoElement) => void
) {
  if (url && !url.includes("video")) return;

  const observer = new MutationObserver(() => {
    const videoElement: HTMLVideoElement | null = document.querySelector(el);
    if (videoElement && videoElement.readyState >= 3) {
      observer.disconnect();
      callback(videoElement);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
