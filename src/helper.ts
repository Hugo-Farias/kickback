export const waitForElement = <T extends Element>(
  selector: string,
): Promise<T | null> => {
  // Wait for video element every 1 second
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      console.log("search");
      const element = document.querySelector<T>(selector);
      if (element) {
        clearInterval(timer);
        resolve(element);
      }
    }, 1000);
    // Timeout after 30 seconds
    setTimeout(() => {
      clearInterval(timer);
      resolve(null);
    }, 30000);
  });
};
